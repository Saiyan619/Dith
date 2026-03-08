# PRODUCTION.md

## Project: Image Dithering Web App

A web application that allows users to upload an image, apply a
dithering effect, preview the result, and download the processed image.

------------------------------------------------------------------------

# 1. Project Goal

Build a fast, browser-based tool that:

-   Accepts an image upload
-   Applies a dithering algorithm
-   Displays the processed image
-   Allows downloading the result

The MVP should run entirely client-side for performance and simplicity.

------------------------------------------------------------------------

# 2. Tech Stack

## Frontend

-   Next.js (App Router)
-   TypeScript
-   TailwindCSS

## Image Processing

-   HTML Canvas API
-   Custom dithering algorithms

## UI / Utilities

-   react-dropzone -- drag-and-drop image upload
-   file-saver -- image download
-   zustand (optional) -- lightweight state management

## Deployment

-   Cloudflare Pages
-   Vercel

No backend required for MVP.

------------------------------------------------------------------------

# 3. Core MVP Features

## Upload Image

Users can upload an image via:

-   drag-and-drop
-   file selection

Supported formats:

-   PNG
-   JPG
-   JPEG
-   WebP

------------------------------------------------------------------------

## Image Preview

After upload:

-   display original image
-   show dimensions
-   display file size

------------------------------------------------------------------------

## Apply Dithering

User clicks **Apply Dither**.

Processing steps:

1.  Draw image onto a canvas
2.  Extract pixel data
3.  Apply dithering algorithm
4.  Render processed pixels

------------------------------------------------------------------------

## Download Image

User can download the processed image.

Export format:

-   PNG

------------------------------------------------------------------------

# 4. Optional MVP Enhancements

## Dither Type Selector

Allow switching algorithms:

-   Floyd--Steinberg
-   Atkinson
-   Bayer
-   Jarvis--Judice--Ninke

------------------------------------------------------------------------

## Color Palette Limit

Allow limiting colors.

Examples:

-   2 colors
-   4 colors
-   8 colors
-   16 colors

------------------------------------------------------------------------

## Pixel Size Control

Allows creating a pixel-art effect.

Example range:

-   Pixel Size: 1--10

------------------------------------------------------------------------

## Resolution Scaling

Allow resizing before processing.

Examples:

-   100%
-   75%
-   50%
-   25%

------------------------------------------------------------------------

## Before / After Slider

Compare images interactively.

Layout example:

Original \| Processed

------------------------------------------------------------------------

# 5. Project Structure

    image-dither-app/

    app/
      page.tsx
      layout.tsx

    components/
      ImageUploader.tsx
      ImagePreview.tsx
      DitherControls.tsx
      CanvasProcessor.tsx
      DownloadButton.tsx

    lib/
      dithering/
        floydSteinberg.ts
        atkinson.ts
        bayer.ts

      image/
        loadImage.ts
        canvasUtils.ts

      utils/
        downloadImage.ts

    styles/
      globals.css

------------------------------------------------------------------------

# 6. Image Processing Flow

User Upload ↓ Load Image ↓ Draw Image to Canvas ↓ Extract Pixel Data ↓
Apply Dither Algorithm ↓ Render Processed Pixels ↓ Preview Result ↓
Download PNG

------------------------------------------------------------------------

# 7. Performance Considerations

### Resize Large Images

If image width \> 2000px: Automatically scale down.

### Use Offscreen Canvas

Use `OffscreenCanvas` if supported.

### Debounce Processing

Avoid re-processing on every UI change.

------------------------------------------------------------------------

# 8. Error Handling

Handle:

### Invalid Files

Reject non-image uploads.

### Large Files

Warn if image \> 10MB.

### Processing Failures

Display message: "Unable to process image. Try a smaller file."

------------------------------------------------------------------------

# 9. Accessibility

Ensure:

-   keyboard accessible controls
-   proper labels
-   focus states
-   contrast compliant UI

------------------------------------------------------------------------

# 10. UI Layout

  -------------
  Upload Area
  -------------

Original Image \| Processed Image

------------------------------------------------------------------------

Controls - Dither Type - Color Limit - Pixel Size

------------------------------------------------------------------------

\[ Apply Dither \] [Download](#download)

------------------------------------------------------------------------

------------------------------------------------------------------------

# 11. Testing Checklist

## Upload

-   drag and drop
-   file picker
-   invalid file

## Processing

-   small image
-   large image
-   different formats

## Download

-   downloaded image opens correctly
-   correct file name

## UI

-   mobile layout
-   desktop layout

------------------------------------------------------------------------

# 12. Future Features

Possible improvements:

-   GPU dithering (WebGL / WebGPU)
-   Batch image processing
-   GIF dithering
-   Video dithering
-   Palette extraction
-   API access
-   user presets
-   shareable links

------------------------------------------------------------------------

# 13. Deployment

## Build

npm run build

## Deploy

Deploy to:

-   Cloudflare Pages
-   Vercel

Environment variables not required.

------------------------------------------------------------------------

# 14. Success Criteria

The MVP is complete when:

-   user can upload image
-   dithering algorithm works
-   preview updates correctly
-   processed image downloads successfully
-   UI works on desktop and mobile
