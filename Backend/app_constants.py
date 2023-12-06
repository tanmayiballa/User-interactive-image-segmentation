import configparser

config = configparser.ConfigParser()
config.read('configurations.conf')

base_endpoint = "/ecc"

test_api_endpoint = base_endpoint + '/test'
upload_file_endpoint = base_endpoint + '/uploadfile'
download_file_endpoint = base_endpoint + '/download-files'
image_output_path = config.get("BASE_PATHS", "image_output_path")
base_models_path = config.get("BASE_PATHS", "base_models_path")

mask_rcnn_file_name = config.get("BASE_MODELS", "mask_rcnn_file_name")


def result_success_template(data, message="Success"):
    return {
        "status": "Success",
        "message": message,
        "data": data
    }


def result_error_template(message=None):
    if message:
        return {
            "status": 'Failed',
            "message": message,
            "data": None,
        }
    else:
        return {
            "status": 'Failed',
            "message": "Error while processing the request",
            "data": None,

        }