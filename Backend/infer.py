import os
import sys
import random
import math
import numpy as np
import skimage.io
import matplotlib
import matplotlib.pyplot as plt
import cv2
import json
from PIL import Image
import warnings
warnings.filterwarnings("ignore")

from Mask_RCNN_clone.mrcnn import utils
import Mask_RCNN_clone.mrcnn.model as modellib
from Mask_RCNN_clone.mrcnn import visualize
from Mask_RCNN_clone.mrcnn import coco

def load_model_weights(root):
    weights_pth = os.path.join(root , "Mask_RCNN_clone/mask_rcnn_coco.h5")
    
    class IConfig(coco.CocoConfig):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1
    
    config = IConfig()

    model_segment = modellib.MaskRCNN(mode="inference", model_dir='mask_rcnn_coco.hy', config=config)
    try:
        model_segment.load_weights(weights_pth, by_name=True)
    except:
        utils.download_trained_weights(weights_pth)
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
    out_pth_det = root + '/output_images/'
    out_pth_mask = root + '/output_images/'

    input_img = skimage.io.imread(img_pth)

    detection = model_segment.detect([input_img], verbose=1)

    param = detection[0]

    predicted_objects = []
    masks_objects = []
    detected_masks = np.swapaxes(param['masks'], 2, 0)
    #print(param[0]['masks'], param[:]['masks'].shape)
    
    cls_ids = param['class_ids']
    object_labels = {}
    for i in range(0, len(cls_ids)):
        cls_id = cls_ids[i]
        cls_name = class_names[cls_id]
        if cls_name not in object_labels.keys():
            object_labels[cls_name] = [i]
        else:
            object_labels[cls_name].append(i)
        predicted_objects.append(cls_name)
        masks_objects.append(detected_masks[i, :, :])

    res_dict = {}
    print(object_labels)
    for label in object_labels.keys():
        res_cls = []
        for j in object_labels[label]:
            user_inp = j
            y1, x1, y2, x2 = param['rois'][user_inp]
            img_det = input_img[y1:y2, x1:x2, :]
            img_det_save = Image.fromarray(img_det)
            img_det_save.save(out_pth_det + '_' + str(label) + '_det_' + str(user_inp) + '.jpg')

            img_mask = masks_objects[user_inp]
            img_mask = img_mask[x1:x2, y1:y2]
            for i in range(img_mask.shape[0]):
                for j in range(img_mask.shape[1]):
                    if img_mask[i][j] == False:
                        img_det[j][i] = [255.0, 255.0, 255.0]
            img_det = Image.fromarray(img_det)
            img_det.save(out_pth_det + '_' + str(label) + '_mask_' + str(user_inp) + '.jpg')
            tmp_dict = {
                "ID": user_inp,
                "det_img_path": out_pth_det + '_' + str(label) + '_det_' + str(user_inp) + '.jpg',
                "mask_img_path": out_pth_det + '_' + str(label) + '_mask_' + str(user_inp) + '_mask.jpg'
            }
            res_cls.append(tmp_dict)
        res_dict[label] = res_cls
    json_object = json.dumps(res_dict, indent=4)
    
    with open("result.json", "w") as outfile:
        outfile.write(json_object)

    return res_dict

if __name__ == '__main__':
    print("Infer Code:")
    res = predict('./Mask_RCNN_clone/images/2516944023_d00345997d_z.jpg')