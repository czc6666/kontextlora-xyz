// This type represents the data returned from our server action
type ActionResult = {
    message: string;
    errors: {
        [key: string]: string[] | undefined;
        prompt?: string[];
        width?: string[];
        height?: string[];
        steps?: string[];
        cfg?: string[];
    } | null;
    imageUrls: string[] | null;
    inputs: {
        [key: string]: any;
    } | null;
}

// This is the type for our client-side history state
export interface HistoryItem extends ActionResult {
  id: number;
  status: 'loading' | 'success' | 'error';
} 