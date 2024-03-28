import tensorflow as tf
import numpy as np
from tensorflow import keras
import sys
import io

def load_and_prep_image(filename, img_shape=299, scale=True):
    """
    Reads in an image from filename, turns it into a tensor, and reshapes it into (img_shape, img_shape, 3).
    Parameters
    ----------
    filename (str): string filename of target image
    img_shape (int): size to resize target image to, default 299
    scale (bool): whether to scale pixel values to range(0, 1), default True
    """
    # Read in the image
    img = tf.io.read_file(filename)
    # Decode it into a tensor
    img = tf.image.decode_jpeg(img)
    # Resize the image
    img = tf.image.resize(img, [img_shape, img_shape])
    if scale:
        # Rescale the image (get all values between 0 and 1)
        return img / 255.
    else:
        return img

def pred_and_return(model, filename, class_names):
    """
    Imports an image located at filename, makes a prediction on it with
    a trained model, and returns the predicted class as a string.
    """
    # Import the target image and preprocess it
    img = load_and_prep_image(filename)

    # Redirect stdout to a StringIO object
    sys.stdout = io.StringIO()

    # Make a prediction
    pred = model.predict(tf.expand_dims(img, axis=0))

    # Get the predicted class
    if len(pred[0]) > 1:  # check for multi-class
        pred_class = class_names[pred.argmax()]  # if more than one output, take the max
    else:
        pred_class = class_names[int(tf.round(pred)[0][0])]  # if only one output, round

    # Reset stdout
    sys.stdout = sys.__stdout__

    # Return the predicted class as a string
    return pred_class

# Load the model
pred_model_inception = keras.models.load_model('inceptionv3_smallds_v2.h5')

# Define class names
class_names = np.array(['battery', 'biological', 'brown-glass', 'cardboard', 'clothes',
                        'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass'])

# Extract the image path from command-line arguments
if len(sys.argv) < 2:
    print("Usage: python predict_image.py <image_path>")
    sys.exit(1)

# Get the image path from the command-line arguments
sample_img = sys.argv[1]

# Make prediction and return the result
prediction_result = pred_and_return(pred_model_inception, sample_img, class_names)

print(prediction_result)  # Print the prediction result
