import React from 'react';
import ImageUploading from 'react-images-uploading';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import _ from 'lodash';

const Upload = ({ onImgChange, images = [] }) => {
  const maxNumber = 10;

  const onChange = async (imageList) => {
    onImgChange(imageList);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        // write your building UI
        <div className="upload__image-wrapper">
          <Button
            size="small"
            type="button"
            variant="contained"
            style={isDragging ? { color: 'red' } : undefined}
            onClick={onImageUpload}
            {...dragProps}
          >
            Click or Drop here
          </Button>
          &nbsp;
          <Button
            size="small"
            type="button"
            variant="contained"
            onClick={onImageRemoveAll}
            {...dragProps}
          >
            Remove all images
          </Button>
          <Grid style={{ margin: '15px 0' }} container spacing={5}>
            {imageList.map((image, index) => (
              <Grid item key={index} xs={12}>
                <div key={index} className="image-item">
                  <img src={image.data_url} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <Button
                      size="small"
                      type="button"
                      variant="contained"
                      onClick={() => onImageUpdate(index)}
                    >
                      Update
                    </Button>
                    &nbsp;
                    <Button
                      size="small"
                      type="button"
                      variant="contained"
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </ImageUploading>
  );
}

export default Upload;
