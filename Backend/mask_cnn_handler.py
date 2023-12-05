import os
import warnings
import traceback
import numpy as np
import skimage.io

from PIL import Image
from fastapi import HTTPException

import app_constants
from logging_utility import logger as log
import Mask_RCNN.mrcnn.model as modellib
from Mask_RCNN.samples.coco import coco

warnings.filterwarnings("ignore")


class Handler:
    def __init__(self):
        try:
            ""
        except Exception as err:
            raise HTTPException(status_code=500, detail="Error while initializing") from err

    def load_model_weights(self):
        try:
            log.info("Loading model weights")
            weights_pth = os.path.join(app_constants.base_models_path, app_constants.mask_rcnn_file_name)
            class IConfig(coco.CocoConfig):
                GPU_COUNT = 1
                IMAGES_PER_GPU = 1

            config = IConfig()

            model_segment = modellib.MaskRCNN(mode="inference", model_dir='mask_rcnn_coco.hy', config=config)
            model_segment.load_weights(weights_pth, by_name=True)
            log.debug("Loaded model weights")
            return model_segment

        except HTTPException as err:
            raise HTTPException(status_code=err.status_code, detail=str(err.detail)) from err

        except Exception as err:
            traceback.print_exc()
            log.error(err)
            raise HTTPException(status_code=500, detail=str(err)) from err

    def get_coco_classes(self):
        return ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane',
                'bus', 'train', 'truck', 'boat', 'traffic light',
                'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird',
                'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear',
                'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie',
                'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
                'kite', 'baseball bat', 'baseball glove', 'skateboard',
                'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
                'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
                'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
                'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
                'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
                'keyboard', 'cell phone', 'microwave', 'oven', 'toaster',
                'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
                'teddy bear', 'hair drier', 'toothbrush']

    def predict(self, img_pth):
        try:
            log.info("Image classification execution started")
            model_segment = self.load_model_weights()
            class_names = self.get_coco_classes()
            out_pth_det1 = os.path.join(app_constants.image_output_path, 'sample_out_det.jpg')
            out_pth_det = '/Users/tanmayiballa/User_interactive_image_segmentation/image-processing-app/src/images/sample_out_det.jpg'
            out_pth_mask1 = os.path.join(app_constants.image_output_path, 'sample_out_mask.jpg')
            out_pth_mask = '/Users/tanmayiballa/User_interactive_image_segmentation/image-processing-app/src/images/sample_out_mask.jpg'
            log.debug(f"Image Path:{img_pth}")
            input_img = skimage.io.imread(img_pth)

            detection = model_segment.detect([input_img], verbose=1)

            param = detection[0]

            predicted_objects = []
            masks_objects = []
            detected_masks = np.swapaxes(param['masks'], 2, 0)
            cls_ids = param['class_ids']
            for i in range(0, len(cls_ids)):
                predicted_objects.append(class_names[cls_ids[i]])
                masks_objects.append(detected_masks[i, :, :])
            log.debug(f"Predicted Images:\n {predicted_objects}")

            user_inp = 1
            y1, x1, y2, x2 = param['rois'][user_inp]
            img_det = input_img[y1:y2, x1:x2, :]
            img_det_save = Image.fromarray(img_det)
            img_det_save.save(out_pth_det)
            img_det_save.save(out_pth_det1)

            img_mask = masks_objects[user_inp]
            img_mask = img_mask[x1:x2, y1:y2]
            for i in range(img_mask.shape[0]):
                for j in range(img_mask.shape[1]):
                    if not img_mask[i][j]:
                        img_det[j][i] = [255.0, 255.0, 255.0]
            img_det = Image.fromarray(img_det)
            img_det.save(out_pth_mask)
            log.info("Successfully classified Image")
            return True

        except HTTPException as err:
            raise HTTPException(status_code=err.status_code, detail=str(err.detail)) from err

        except Exception as err:
            traceback.print_exc()
            log.error(err)
            raise HTTPException(status_code=500, detail=str(err)) from err
