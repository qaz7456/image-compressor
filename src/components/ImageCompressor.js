import React, { useState } from 'react';
import { Box, Button, CircularProgress, LinearProgress, Typography, Backdrop, TextField, Snackbar, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const compressImage = async (file, targetSizeKB, setProgress) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let low = 0;
      let high = 1;
      let bestBlob = null;
      let bestFileSize = Infinity;

      const checkSize = async (quality) => {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const response = await fetch(compressedDataUrl);
        return response.blob();
      };

      const binarySearch = async () => {
        while (low <= high) {
          const mid = (low + high) / 2;
          const blob = await checkSize(mid);
          const fileSizeKB = blob.size / 1000;

          const progressPercentage = Math.round(((1 - (high - low)) / 1) * 100);
          setProgress(progressPercentage);

          if (Math.abs(fileSizeKB - targetSizeKB) < Math.abs(bestFileSize - targetSizeKB)) {
            bestBlob = blob;
            bestFileSize = fileSizeKB;
          }

          if (fileSizeKB > targetSizeKB) {
            high = mid - 0.01;
          } else {
            low = mid + 0.01;
          }
        }
        resolve(bestBlob);
      };

      binarySearch();
    };

    img.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

const ImageCompressor = () => {
  const [image, setImage] = useState(null);
  const [targetSize, setTargetSize] = useState(300);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        setError('Please upload a valid image file.');
        setSnackbarOpen(true);
        setImage(null);
        return;
      }
      setImage(file);
      setProgress(0);
      setError('');
    }
  };

  const handleSizeChange = (e) => {
    setTargetSize(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image to compress.');
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const compressedBlob = await compressImage(image, targetSize, setProgress);
      const compressedUrl = URL.createObjectURL(compressedBlob);
      setDownloadUrl(compressedUrl);
    } catch (error) {
      setError('Image compression failed, please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: 'auto', textAlign: 'center', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Image Compressor Tool</Typography>

      <form onSubmit={handleSubmit}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ mb: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
            required
          />
        </Button>

        <TextField
          type="number"
          label="Target Size (KB)"
          value={targetSize}
          onChange={handleSizeChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
        />

        <Box sx={{ height: 10, display: 'flex', alignItems: 'center', mb: 2 }}>
          {progress > 0 && (
            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} />
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!image || loading}
        >
          Compress Image
        </Button>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>

      {downloadUrl && (
        <Button
          href={downloadUrl}
          download="compressed_image.jpg"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Download Compressed Image
        </Button>
      )}

      <Backdrop
        open={loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>Compressing...</Typography>
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default ImageCompressor;