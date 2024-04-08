# from django.shortcuts import render
# import tensorflow as tf
# import numpy as np
# from tensorflow import keras
# import sys
# import io
# from pathlib import Path
# import os

# from django.template.loader import get_template
# from django.core.files.storage import FileSystemStorage
# BASE_DIR = Path(__file__).resolve().parent.parent
# model_file_path = os.path.join(BASE_DIR, 'inceptionv3_smallds_v2.h5')
# # model_file_path = os.path.join(BASE_DIR, 'predictionapp/models/inceptionv3_smallds_v2.h5')


# pred_model_inception = keras.models.load_model(model_file_path)

# # Define class names
# class_names = np.array(['battery', 'biological', 'brown-glass', 'cardboard', 'clothes',
#                         'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass'])


# # Create your views here.
# def home(request):

#     context={'len':0}

#     if request.method == 'POST':
#         image=request.FILES.get('image')
#         fs= FileSystemStorage()
#         filepathname= fs.save(image.name,image)
#         print(filepathname)
#         testimage=filepathname
        
#         prediction_result = pred_and_return(pred_model_inception, testimage, class_names)

#         context={'result': prediction_result, 'len':len(prediction_result)}
#         print(prediction_result)

#         return render(request, 'predictionapp/home.html',context)
        

#     return render(request, 'predictionapp/home.html',context)


# def load_and_prep_image(filename, img_shape=299, scale=True):
#     """
#     Reads in an image from filename, turns it into a tensor, and reshapes it into (img_shape, img_shape, 3).
#     Parameters
#     ----------
#     filename (str): string filename of target image
#     img_shape (int): size to resize target image to, default 299
#     scale (bool): whether to scale pixel values to range(0, 1), default True
#     """
#     # Read in the image
#     img_path = os.path.join(BASE_DIR, 'static/images', filename)
#     img = tf.io.read_file(img_path)
#     # Decode it into a tensor
#     img = tf.image.decode_jpeg(img)
#     # Resize the image
#     img = tf.image.resize(img, [img_shape, img_shape])
#     if scale:
#         # Rescale the image (get all values between 0 and 1)
#         return img / 255.
#     else:
#         return img

# def pred_and_return(model, filename, class_names):
#     """
#     Imports an image located at filename, makes a prediction on it with
#     a trained model, and returns the predicted class as a string.
#     """
#     # Import the target image and preprocess it
#     img = load_and_prep_image(filename)

#     # Redirect stdout to a StringIO object
#     sys.stdout = io.StringIO()

#     # Make a prediction
#     pred = model.predict(tf.expand_dims(img, axis=0))

#     # Get the predicted class
#     if len(pred[0]) > 1:  # check for multi-class
#         pred_class = class_names[pred.argmax()]  # if more than one output, take the max
#     else:
#         pred_class = class_names[int(tf.round(pred)[0][0])]  # if only one output, round

#     # Reset stdout
#     sys.stdout = sys.__stdout__

#     # Return the predicted class as a string
#     return pred_class

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.http import HttpResponseServerError
import tensorflow as tf
from tensorflow import keras
import numpy as np
import os

model_path = os.path.join(settings.BASE_DIR, 'predictionapp/inceptionv3_smallds_v2.h5')
pred_model_inception = keras.models.load_model(model_path)

class PredictAPIView(APIView):
    def load_and_prep_image(self, filename, img_shape=299, scale=True):
        """
        Reads in an image from filename, turns it into a tensor, and reshapes it into (img_shape, img_shape, 3).
        Parameters
        ----------
        filename (str): string filename of target image
        img_shape (int): size to resize target image to, default 299
        scale (bool): whether to scale pixel values to range(0, 1), default True
        """
        img_path = os.path.join(settings.BASE_DIR, 'media', filename)
        img = tf.io.read_file(img_path)
        img = tf.image.decode_jpeg(img)
        img = tf.image.resize(img, [img_shape, img_shape])
        if scale:
            return img / 255.
        else:
            return img

    def pred_and_return(self, filename):
        """
        Imports an image located at filename, makes a prediction on it with
        a trained model, and returns the predicted class as a string.
        """
        
        class_names = np.array(['battery', 'biological', 'brown-glass', 'cardboard', 'clothes',
                                'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass'])

        img = self.load_and_prep_image(filename)

        pred = pred_model_inception.predict(tf.expand_dims(img, axis=0))

        if len(pred[0]) > 1:
            pred_class = class_names[pred.argmax()]
        else:
            pred_class = class_names[int(tf.round(pred)[0][0])]

        return pred_class

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        image = request.FILES['image']
        fs = FileSystemStorage()
        saved_path = fs.save(image.name, image)
        image_path = fs.path(saved_path)
        print(image_path)

        try:
            prediction_result = self.pred_and_return(image_path)
        except Exception as e:
            # Handle errors
            return HttpResponseServerError({'error': str(e)})

        os.remove(image_path)

        print(prediction_result)

        return Response({'Category': prediction_result}, status=status.HTTP_200_OK)
