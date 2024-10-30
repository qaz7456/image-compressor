# ImageCompressor Tool

This tool was developed to address a specific need for image compression.

## Background

The motivation behind its creation stemmed from the requirement to provide square images under a specific file size limit (e.g., 500 KB) for push notifications in mobile apps. While cropping images to a square is easily accomplished with built-in tools on both computers and phones, resizing to a specific file size is not as straightforward, as most devices lack built-in file compression options.

I initially sought a simple way to compress high-quality images for use in mobile app push notifications. Although many online tools exist for image compression, I encountered several drawbacks:

- **Speed**: Some online tools took too long to process.
- **Complexity**: Others required configuring numerous settings that weren’t necessary for a quick compression task.
- **Quality Control**: Many tools didn’t provide the right balance between quality and size for my needs.

Given these limitations, I decided to create a simple, easy-to-use tool that compresses images to a target file size directly in the browser, without the need to install any software or apps.

## Features

- **File Size Control**: Simply enter a target file size in KB, and the tool compresses the image to fit within that limit.
- **On-the-Fly Compression**: Compression is handled directly in the browser for speed and privacy—no data leaves your device.
- **Quality Optimization**: Using a binary search approach, the tool adjusts quality to achieve the best possible image within the size constraint.

## Technology

The tool is built using **Vanilla JavaScript** and **Web APIs**, making it compatible with most modern browsers and ensuring fast performance.

## Usage

1. **Upload an Image**: Select any image from your device.
2. **Set Target Size**: Input the maximum file size in KB.
3. **Compress**: The tool will adjust the image quality to match your target size.
4. **Download**: Save the compressed image to your device.

This straightforward approach allows for reliable image compression directly in the browser.

## Deployment

The project is deployed on **GitHub Pages**. If you prefer not to set up a local environment, you can directly use the tool online at [GitHub Pages URL](https://qaz7456.github.io/image-compressor/).

## Installation

To run the tool locally:

```bash
git clone [repo-url]
npm install
npm start
```

This will start the application locally for personal use or further customization.