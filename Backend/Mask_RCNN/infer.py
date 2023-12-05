import os
import sys
import random
import math
import numpy as np
import skimage.io
import matplotlib
import matplotlib.pyplot as plt
import cv2
from PIL import Image
import warnings
warnings.filterwarnings("ignore")

from mrcnn import utils
import mrcnn.model as modellib
from mrcnn import visualize
from samples.coco import coco

def load_model_weights(root):
    weights_pth = os.path.join(root , "mask_rcnn_coco.h5")
    
    class IConfig(coco.CocoConfig):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1
    
    config = IConfig()

    model_segment = modellib.MaskRCNN(mode="inference", model_dir='mask_rcnn_coco.hy', config=config)
    model_segment.load_weights(weights_pth, by_name=True)
    return model_segment

def get_coco_classes():
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

def predict(img_pth):
    root = os.getcwd()
    model_segment = load_model_weights(root)
    class_names = get_coco_classes()
    out_pth_det = root + '/images/sample_out_det.jpg'
    out_pth_mask = root + '/images/sample_out_mask.jpg'

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

    #res_img = visualize.display_instances(input_img, param['rois'], param['masks'], param['class_ids'], class_names, param['scores'])
    #res_img = Image.fromarray(res_img)
    #res_img.save(out_pth)
    user_inp = 1
    y1, x1, y2, x2 = param['rois'][user_inp]
    img_det = input_img[y1:y2, x1:x2, :]
    img_det_save = Image.fromarray(img_det)
    img_det_save.save(out_pth_det)

    img_mask = masks_objects[user_inp]
    img_mask = img_mask[x1:x2, y1:y2]
    for i in range(img_mask.shape[0]):
        for j in range(img_mask.shape[1]):
            if img_mask[i][j] == False:
                img_det[j][i] = [255.0, 255.0, 255.0]
    img_det = Image.fromarray(img_det)
    img_det.save(out_pth_mask)
    return

if __name__ == '__main__':
    print("Infer Code:")
    #root = os.getcwd()
    #img_pth = sys.argv[1]
    # out_pth_det = root + '/images/sample_out_det.jpg'
    # out_pth_mask = root + '/images/sample_out_mask.jpg'
    #model_segment = load_model_weights(root)

    #class_names = get_coco_classes()

    # input_img = skimage.io.imread(img_pth)

    # detection = model_segment.detect([input_img], verbose=1)

    # param = detection[0]

    # predicted_objects = []
    # masks_objects = []
    # detected_masks = np.swapaxes(param['masks'], 2, 0)
    # cls_ids = param['class_ids']
    # for i in range(0, len(cls_ids)):
    #     predicted_objects.append(class_names[cls_ids[i]])
    #     masks_objects.append(detected_masks[i, :, :])

    # #res_img = visualize.display_instances(input_img, param['rois'], param['masks'], param['class_ids'], class_names, param['scores'])
    # #res_img = Image.fromarray(res_img)
    # #res_img.save(out_pth)
    # user_inp = 1
    # y1, x1, y2, x2 = param['rois'][user_inp]
    # img_det = input_img[y1:y2, x1:x2, :]
    # img_det_save = Image.fromarray(img_det)
    # img_det_save.save(out_pth_det)

    # img_mask = masks_objects[user_inp]
    # img_mask = img_mask[x1:x2, y1:y2]
    # for i in range(img_mask.shape[0]):
    #     for j in range(img_mask.shape[1]):
    #         if img_mask[i][j] == False:
    #             img_det[j][i] = [255.0, 255.0, 255.0]
    # img_det = Image.fromarray(img_det)
    # img_det.save(out_pth_mask)