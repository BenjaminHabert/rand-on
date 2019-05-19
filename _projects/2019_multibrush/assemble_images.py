from collections import namedtuple
import re
import os

import click
from PIL import Image

ParsedFile = namedtuple("ParsedFile", ["path", "x", "y"])


@click.command()
@click.argument("files", nargs=-1)
def assamble(files):
    """Assemble several files in a big grid image."""
    parsed_files, base_path = parse_files(files)
    assambled_image = assamble_images(parsed_files)
    final_path = base_path + ".jpg"
    print("saving: " + final_path)
    assambled_image.save(final_path)


def assamble_images(parsed_files):
    xs = sorted(set(f.x for f in parsed_files))
    ys = sorted(set(f.y for f in parsed_files))
    parsed_files = {(f.x, f.y): f for f in parsed_files}

    width, margin = get_sizes(list(parsed_files.values())[0])
    big_image = prepare_image(len(xs), len(ys), width, margin)

    for i in range(len(xs)):
        for j in range(len(ys)):
            x, y = xs[i], ys[j]
            f = parsed_files[(x, y)]
            print("loading: " + str(f))
            image = Image.open(f.path)

            x_offset = i * width + (i + 1) * margin
            y_offset = j * width + (j + 1) * margin
            big_image.paste(image, (x_offset, y_offset))

    return big_image


def prepare_image(nx, ny, width, margin):
    total_width = nx * width + (nx + 1) * margin
    total_height = ny * width + (ny + 1) * margin
    new_img = Image.new("RGB", (total_width, total_height), color="white")
    return new_img


def get_sizes(parsed_file):
    image = Image.open(parsed_file.path)
    width = image.size[0]
    margin = width // 10
    return width, margin


def parse_files(files):
    parsed = []
    for filename in files:
        try:
            path = filename
            filename = os.path.basename(filename)
            pattern = r"(\w+)_([\d\.]+)_([\d\.]+)"
            result = re.search(pattern, filename)
            base_name, x, y = result.groups()[:]
            parsed.append(ParsedFile(path, x, y))
        except AttributeError:
            pass
    base_path = os.path.join(os.path.dirname(path), base_name)
    return parsed, base_path


if __name__ == "__main__":
    assamble()
