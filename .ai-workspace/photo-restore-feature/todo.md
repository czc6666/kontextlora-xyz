# AI Photo Restore Feature - ToDo

### 1. Create Page Route
- [ ] Create `app/photo-restore/page.tsx` file to serve as the entry point for the new feature.

### 2. Build Core Components
- [ ] Create the left-side **Control Panel** component (`components/photo-restore/control-panel.tsx`) containing the file upload area, watermark switch, and run button.
- [ ] Create the right-side **Result Panel** component (`components/photo-restore/result-panel.tsx`) to display the restored image.
- [ ] Create the **Feature Examples** component (`components/photo-restore/examples.tsx`) showcasing two "before/after" comparison images.
- [ ] Create the **FAQ (Frequently Asked Questions)** component (`components/photo-restore/faq.tsx`) to introduce the feature in a Q&A format.

### 3. Assemble the Page
- [ ] Import all newly created components into `photo-restore/page.tsx` and assemble them according to the template's layout (two-column layout + bottom content).

### 4. Add Navigation
- [ ] (Optional but recommended) Add an entry point in the website's main `Header` component to make the new feature easily accessible to users. 