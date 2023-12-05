import configparser

config = configparser.ConfigParser()
config.read('configurations.conf')

base_endpoint = "/ecc"

test_api_endpoint = base_endpoint + '/test'

image_output_path = config.get("BASE_PATHS", "image_output_path")
