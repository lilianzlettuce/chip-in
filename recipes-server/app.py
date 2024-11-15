from flask import Flask, request, jsonify
from flaxrec import generation_function
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/generate-recipe', methods=['POST'])
def generate_recipe_endpoint():
    data = request.get_json()
    items = data.get('items', '')
    print(items)

    recipes = generation_function(items)
    recipe_parts = {}

    for text in recipes:
        sections = text.split("\n")
        for section in sections:
            section = section.strip()
            if section.startswith("title:"):
                section = section.replace("title:", "")
                headline = "title"
            elif section.startswith("ingredients:"):
                section = section.replace("ingredients:", "")
                headline = "ingredients"
            elif section.startswith("directions:"):
                section = section.replace("directions:", "")
                headline = "directions"
            
            if headline == "title":
                recipe_parts['title'] = f'{section.strip().capitalize()}'
            elif headline == 'ingredients':
                recipe_parts['ingredients'] = ''
                for item in section.split("--"):
                    recipe_parts['ingredients'] = recipe_parts['ingredients'] + f'\n- {item}'

            else:
                recipe_parts['directions'] = ''
                for i, item in enumerate(section.split("--"), start=1):
                    recipe_parts['directions'] = recipe_parts['directions'] + f'\n{i}. {item}'

    return jsonify(recipe_parts)

if __name__ == '__main__':
    app.run(debug=True, port=4200)