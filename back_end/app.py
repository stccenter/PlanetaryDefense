import json
from flask import Flask, request, jsonify
import flask
import psycopg2
# bussiness logic part


def append_query(start_year, end_year, word_list, query, template):
    i = 1
    condition = template.replace('placeholder', word_list[0])
    while i < len(word_list):
        condition = condition + \
            ' AND ' + template.replace('placeholder', word_list[i])
        i += 1
    new_query = query.format(condition)
    return new_query

# flask part


app = Flask(__name__, static_folder='../dist/static')


@app.route('/search', methods=['GET'])
def search():
    type = request.args.get('type')
    text = request.args.get('text')
    start_year = request.args.get('start')
    end_year = request.args.get('end')
    text = text.lower()
    word_list = text.split(' ')
    query = 'select * from pd_pub_main where {}'

    if type == '1':
        template = '''
        (
          (lower(title) LIKE '%placeholder%')
          OR (lower(keyword) LIKE '%placeholder%')
          OR (lower(keyword_plus) LIKE '%placeholder%')
          OR (lower(abstract) LIKE '%placeholder%')
        )
      '''

    elif type == '2':
        template = '''
        (
          (lower(author_full) LIKE '%placeholder%')
          OR (lower(author) LIKE '%placeholder%')
        )
      '''

    elif type == '3':
        template = '''
        (
          (lower(nation) LIKE '%placeholder%')
        )
      '''

    elif type == '4':
        template = '''
        (
          (lower(keyword) LIKE '%placeholder%')
          OR (lower(keyword_plus) LIKE '%placeholder%')
        )
      '''

    elif type == '5':
        template = '''
        (
          (lower(institute) LIKE '%placeholder%')
        )
      '''

    query = append_query(start_year, end_year, word_list, query, template)

    if text == '':
        if start_year != '' and end_year != '':
            query = 'select * from pd_pub_main where year >= {} and year <= {}'.format(
                start_year, end_year)
        else:
            query = 'select * from pd_pub_main'

    elif start_year != '' and end_year != '':
        query = query + \
            ' AND (year >= {} and year <= {})'.format(start_year, end_year)

    # database connection part
    conn = psycopg2.connect(database='', host='',
                            user='', password='', port='')
    cur = conn.cursor()

    cur.execute(query)
    result = cur.fetchall()
    payload = []
    content = {}
    for record in result:
        content = {'id': record[0],
                   'title': record[4],
                   'author': record[6],
                   'author_full': record[7],
                   'institute': record[8],
                   'nation': record[9],
                   'keyword': record[10],
                   'keyword_plus': record[11],
                   'cite_num': record[13],
                   'month': record[14],
                   'year': record[15],
                   'doi': record[18],
                   'research_areas': record[19],
                   'reference': record[20]}
        if record[6]:
            content['author'] = record[6].split('; ')
        if record[7]:
            content['author_full'] = record[7].split('; ')
        if record[8]:
            content['institute'] = record[8].split('; ')
        if record[9]:
            content['nation'] = record[9].split('; ')
        if record[10]:
            content['keyword'] = record[10].split('; ')
        if record[11]:
            content['keyword_plus'] = record[11].split('; ')
        payload.append(content)
        content = {}

    return jsonify(payload)


if __name__ == '__main__':
    app.run(debug=True)
