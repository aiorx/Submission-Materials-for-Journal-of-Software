from notion_client import Client
# import configparser
import json
from .. import client
from . import func


#notionの基本的な流れはデータをとってきて、取得したいデータまで辞書型の階層をさかのぼってデータをとる感じ
#この時get()メソッドを使うほうがいいらしい。
#get()メソッドを使用すると、指定したキーが存在しない場合にプログラムがエラーをスローせず、代わりにデフォルト値を返すことができます。
# これにより、プログラムの安全性が向上し、エラーを回避できます。

def get_notion_api_key():#config.iniからapi_keyを取得する
    # config = configparser.ConfigParser()
    # config.read('./config.ini')
    # api_key = config['DEFAULT']['API_KEY']
    api_key="here"
    client=Client(auth=api_key)
    return client

##各関数の先頭に    client = get_notion_api_key()をつける
#いらない

def fetch_category(database_id):
    response = client.databases.query(
        **{
            "database_id": database_id,
        }
    )
    response = response["results"]
    category=[]
    for res in response:
        res=res["properties"]["Category"]["multi_select"]
        for cat in res:
            cat=convert_unicode_to_japanese(cat["name"])
            print(cat)
            if cat not in category:
                category.append(cat)
    # with open("contents.json", "w") as f:
    #     json.dump(category, f, indent=4)
    return category


def read_notion_database(database_id):# データベースの全ての情報を取得する
    # client = get_notion_api_key()
    response = client.databases.query(
        **{
            "database_id": database_id,
        }
    )

    print(response)
    return response

def get_edit_db(page_id):
    return func.convert_date_format(client.blocks.children.list(page_id)["results"][0]["last_edited_time"])
    # return client.blocks.children.list(page_id)

def get_page_title(page_id):#title取得
    # client = get_notion_api_key()
    response = client.pages.retrieve(
        **{
            "page_id": page_id,
            "properties": [
                "Title"
            ]
        }
    )

    return response["properties"]["Title"]["title"][0]["plain_text"]


def get_page_content(page_id):#ページの内容取得
    # client = get_notion_api_key()
    data = client.blocks.children.list(
        **{
            "block_id": page_id,
            "page_size": 50
        }
    )
    # print(data)
    data_str = json.dumps(data)
    response=extract_content(data_str)
    return response


#Crafted with standard coding tools
def get_database_pages_and_public(database_id):#OK
    """データベースIDからすべてのページIDとプロパティ「public」を取得する"""
    # client = get_notion_api_key()
    query = client.databases.query(database_id=database_id)
    results = []
    for page in query['results']:
        page_id = page['id']
        public = page['properties'].get('public', {}).get('checkbox', False)
        results.append({'page_id': page_id, 'public': public})
    return results


#Crafted with standard coding tools & me
def get_page_properties_title_category_creation_date(page_id):#OK
    """ページIDからプロパティ「Title」、「Category」、「Creation date」を取得する"""
    # client = get_notion_api_key()
    page = client.pages.retrieve(page_id=page_id)
    title = page['properties'].get('Title', {}).get('title', [])[0].get('plain_text', '')
    category = [option['name'] for option in page['properties'].get('Category', {}).get('multi_select', [])]
    creation_date = page['properties'].get('Creation date', {}).get('created_time', '')
    creation_date = func.convert_date_format(creation_date)
    print(page)
    return {'title': title, 'category': category, 'creation_date': creation_date}


#Crafted with standard coding tools & me
def get_page_property_last_updated(page_id):#OK
    """ページIDからプロパティ「Last updated」を取得する"""
    # client = get_notion_api_key()
    page = client.pages.retrieve(page_id=page_id)
    last_updated = page['properties'].get('Last updated', {}).get('last_edited_time', '')
    last_updated = func.convert_date_format(last_updated)
    return {'last_updated': last_updated}


#Crafted with standard coding tools & ME
def get_filtered_pages(database_id, specific_category=None, start_cursor=0):#OK
    """データベースIDからpublicがTrueで、特定のカテゴリがあればそのカテゴリに一致するページを取得し、作成日が最新順にデータを返す。
    start_cursorを指定することで、次のページのデータを取得することができる。"""
    # client = get_notion_api_key()
    # query_params = {
    #     "database_id": database_id,
    #     "filter": {
    #         "and": [
    #             {"property": "public", "checkbox": {"equals": True}},
    #             {"property": "Category", "multi_select": {"contains": specific_category}} if specific_category else {}
    #         ]
    #     },
    #     "sorts": [{"property": "Creation date", "direction": "descending"}],
    #     "page_size": 10
    # }

    # APIのレスポンスを取得
    # if specific_category == None:
    query = client.databases.query(database_id=database_id)
    # else:
    #     query = client.databases.query(
    #         {
    #             "database_id": database_id,
    #             "filter": {
    #                 "property": "Category",
    #                 "rich_text": {
    #                 "equals": specific_category
    #                 }
    #             }
    #             }
    #         )
    # i=start_cursor
    # APIのレスポンスを適切に処理
    results = []
    sorted_results = []
    for page in query['results']:
        # if 0<i:
        #     i-=1
        #     continue
        public = page['properties'].get('public', {}).get('checkbox', False)
        if False == public:
            # start_cursor+=1
            continue
        category = [option['name'] for option in page['properties'].get('Category', {}).get('multi_select', [])]
        if specific_category == None:
            pass
        elif specific_category in category:
            pass
        else:
            continue
        # start_cursor+=1
        page_id = page['id']
        title = page['properties'].get('Title', {}).get('title', [])
        if title:
            title = title[0].get('plain_text', '')
        else:
            title = 'No Title Available'
        last_edit_day = page['properties'].get('Last updated', {}).get('last_edited_time', '')
        last_edit_day = func.convert_date_format(last_edit_day)
        print(last_edit_day)
        results.append({'page_id': page_id, 'title': title, 'category': category, 'Last_updated': last_edit_day})
        sorted_results = sorted(results, key=lambda page: page['Last_updated'], reverse=True)
    #     print(start_cursor)
    #     if start_cursor%10==0:
    #         break
    # start_cursor+=add_cursor
    # if start_cursor%10!=0:
    #     start_cursor=int(start_cursor/10)
    #     start_cursor=start_cursor*10+10

    # next_cursor = start_cursor
    # print(results)
    return sorted_results










#Crafted with standard coding tools
def extract_content(data):#ページの内容から必要な情報のみ抽出する
    """
    Notionのページデータからテキストベースおよび非テキストベースのブロックの内容を抽出し、
    各コンテンツを['block_type', 'content']の形式の配列にして返す。

    Args:
        data (str): Notion APIから取得したJSON形式の文字列。

    Returns:
        list: ['block_type', 'content']形式の配列のリスト。
    """
    # JSON文字列をPythonの辞書に変換
    data_dict = json.loads(data)

    # コンテンツを格納するためのリスト
    contents = []

    # results配列をループして、ブロックの内容を抽出
    for block in data_dict["results"]:
        block_type = block["type"]
        if block_type in ["paragraph", "heading_1", "heading_2", "heading_3", "bulleted_list_item"]:
            # テキストブロックからテキストを取得
            for text_element in block[block_type]["rich_text"]:

                text_content = text_element["plain_text"]
                contents.append([block_type, text_content])
                # リンクがあればURLも抽出し、別の要素として追加
                if text_element["text"].get("link"):
                    link_url = text_element["text"]["link"]["url"]
                    contents.append([f"{block_type} Link", link_url])
            if block_type in ["heading_1", "heading_2", "heading_3"]:
                result=get_page_content(block["id"])
                if result != []:
                    contents[-1][0] = "nest "+contents[-1][0]
                    for content in result:
                        contents.append(content)
        elif block_type == "image":
            # 画像ブロックからURLを取得
            image_url = block["image"]["file"]["url"]
            contents.append([block_type, image_url])
        elif block_type == "bookmark":
            # ブックマークブロックからURLを取得
            if "bookmark" in block:
                bookmark_url = block["bookmark"]["url"]
                contents.append([block_type, bookmark_url])
        elif block_type == "code":
            for text_element in block[block_type]["rich_text"]:
                text_content = text_element["plain_text"]
                i=0
                content=[]
                for x in text_content:

                    if i==0:
                        y=x
                        i=1
                    else:
                        if x=="\n":
                            content.append(y)
                            i=0
                            y=""
                        else:
                            y+=x
                content.append(y)
                contents.append([block_type, content])



    return contents

def is_unicode_escape(text):

    import re
    # \uXXXXのパターンにマッチするか確認
    pattern = r'\\u[0-9a-fA-F]{4}'
    return bool(re.search(pattern, text))

def convert_unicode_to_japanese(text):

    try:
        # すでに通常の文字列の場合はそのまま返す
        if not is_unicode_escape(text):
            return text

        # Unicodeエスケープシーケンスを評価して文字列に変換
        decoded_text = text.encode('utf-8').decode('unicode-escape')
        return decoded_text
    except Exception as e:
        print(f"変換エラー: {e}")
        return text
