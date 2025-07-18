import { createServiceRoleClient } from "./service-role";
import { CreemCustomer, CreemSubscription } from "@/types/creem";

/**
 * Creates or updates a customer record in the database based on a Creem customer object.
 * @param {CreemCustomer} creemCustomer - The customer object from Creem.
 * @param {string} userId - The user's unique ID from Supabase Auth.
 * @returns {Promise<string>} The ID of the created or updated customer in the database.
 */
export async function createOrUpdateCustomer(
  creemCustomer: CreemCustomer,
  userId: string
) {
  const supabase = createServiceRoleClient();

  const { data: existingCustomer, error: fetchError } = await supabase
    .from("customers")
    .select()
    .eq("creem_customer_id", creemCustomer.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (existingCustomer) {
    const { error } = await supabase
      .from("customers")
      .update({
        email: creemCustomer.email,
        name: creemCustomer.name,
        country: creemCustomer.country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingCustomer.id);

    if (error) throw error;
    return existingCustomer.id;
  }

  const { data: newCustomer, error } = await supabase
    .from("customers")
    .insert({
      user_id: userId,
      creem_customer_id: creemCustomer.id,
      email: creemCustomer.email,
      name: creemCustomer.name,
      country: creemCustomer.country,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return newCustomer.id;
}

/**
 * Creates or updates a subscription record in the database based on a Creem subscription object.
 * @param {CreemSubscription} creemSubscription - The subscription object from Creem.
 * @param {string} customerId - The internal customer ID.
 * @returns {Promise<string>} The ID of the created or updated subscription.
 */
export async function createOrUpdateSubscription(
  creemSubscription: CreemSubscription,
  customerId: string
) {
  const supabase = createServiceRoleClient();

  const { data: existingSubscription, error: fetchError } = await supabase
    .from("subscriptions")
    .select()
    .eq("creem_subscription_id", creemSubscription.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  const subscriptionData = {
    customer_id: customerId,
    creem_product_id:
      typeof creemSubscription?.product === "string"
        ? creemSubscription?.product
        : creemSubscription?.product?.id,
    status: creemSubscription?.status,
    current_period_start: creemSubscription?.current_period_start_date,
    current_period_end: creemSubscription?.current_period_end_date,
    canceled_at: creemSubscription?.canceled_at,
    metadata: creemSubscription?.metadata,
    updated_at: new Date().toISOString(),
  };

  if (existingSubscription) {
    const { error } = await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existingSubscription.id);

    if (error) throw error;
    return existingSubscription.id;
  }

  const { data: newSubscription, error } = await supabase
    .from("subscriptions")
    .insert({
      ...subscriptionData,
      creem_subscription_id: creemSubscription.id,
    })
    .select()
    .single();

  if (error) throw error;
  return newSubscription.id;
}

/**
 * Retrieves the active subscription for a given user.
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<object | null>} The active subscription object or null if not found.
 */
export async function getUserSubscription(userId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      customer:customers(user_id)
    `
    )
    .eq("customer.user_id", userId)
    .eq("status", "active")
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

/**
 * Adds credits to a customer's account and records the transaction.
 * @param {string} customerId - The internal customer ID.
 * @param {number} credits - The number of credits to add.
 * @param {string} [creemOrderId] - Optional Creem order ID for tracking.
 * @param {string} [description] - Optional description for the transaction.
 * @returns {Promise<number>} The new credit balance.
 */
export async function addCreditsToCustomer(
  customerId: string,
  credits: number,
  creemOrderId?: string,
  description?: string
) {
  const supabase = createServiceRoleClient();
  // Start a transaction
  const { data: client } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", customerId)
    .single();
  if (!client) throw new Error("Customer not found");
  const newCredits = (client.credits || 0) + credits;

  // Update customer credits
  const { error: updateError } = await supabase
    .from("customers")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("id", customerId);

  if (updateError) throw updateError;

  // Record the transaction in credits_history
  const { error: historyError } = await supabase
    .from("credits_history")
    .insert({
      customer_id: customerId,
      amount: credits,
      type: "add",
      description: description || "Credits purchase",
      creem_order_id: creemOrderId,
    });

  if (historyError) throw historyError;

  return newCredits;
}

/**
 * Deducts credits from a customer's account and records the transaction.
 * @param {string} customerId - The internal customer ID.
 * @param {number} credits - The number of credits to use.
 * @param {string} description - A description for the transaction (e.g., "Image generation").
 * @returns {Promise<number>} The new credit balance.
 */
export async function useCredits(
  customerId: string,
  credits: number,
  description: string
) {
  const supabase = createServiceRoleClient();

  // Start a transaction
  const { data: client } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", customerId)
    .single();
  if (!client) throw new Error("Customer not found");
  if ((client.credits || 0) < credits) throw new Error("Insufficient credits");

  const newCredits = client.credits - credits;

  // Update customer credits
  const { error: updateError } = await supabase
    .from("customers")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("id", customerId);

  if (updateError) throw updateError;

  // Record the transaction in credits_history
  const { error: historyError } = await supabase
    .from("credits_history")
    .insert({
      customer_id: customerId,
      amount: credits,
      type: "subtract",
      description,
    });

  if (historyError) throw historyError;

  return newCredits;
}

/**
 * Retrieves the current credit balance for a customer.
 * @param {string} customerId - The internal customer ID.
 * @returns {Promise<number>} The current credit balance.
 */
export async function getCustomerCredits(customerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("customers")
    .select("credits")
    .eq("id", customerId)
    .single();

  if (error) throw error;
  return data?.credits || 0;
}

/**
 * Retrieves the credit transaction history for a customer.
 * @param {string} customerId - The internal customer ID.
 * @returns {Promise<Array<object>>} A list of credit history records.
 */
export async function getCreditsHistory(customerId: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("credits_history")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
