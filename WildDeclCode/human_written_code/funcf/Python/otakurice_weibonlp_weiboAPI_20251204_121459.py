```python
def fetch_and_store_comments(client, comment_num_start=1, page_start=1):
    comment_num = comment_num_start
    i = page_start

    while True:
        r = client.comments.show.get(id=4154417035431509, count=200, page=i)
        if len(r.comments):
            print('第 %s 页' % i)
            for st in r.comments:
                print('第 %s 条评论' % comment_num)
                created_at = st.created_at
                comment_id = st.id
                text = re.sub('回复.*?:', '', str(st.text))
                source = re.sub('<.*?>|</a>', '', str(st.source))
                user_name = st.user.screen_name
                followers = st.user.followers_count
                follow = st.user.friends_count
                province = st.user.province
                print(created_at)
                print(comment_id)
                print(text)
                print(source)
                print('评论者：%s,粉丝数：%s,关注数：%s,所在省份编号：%s' % (user_name, followers, follow, province))
                print('\n')
                conn = pymysql.connect(host='127.0.0.1', user='root', password='1314', charset="utf8", use_unicode=False)
                cur = conn.cursor()
                sql = "insert into xue.xueresponse(created_at,comment_id,text,source,user_name,followers,follow,province) values(%s,%s,%s,%s,%s,%s,%s,%s)"
                param = (created_at, comment_id, text, source, user_name, followers, follow, province)
                try:
                    A = cur.execute(sql, param)
                    conn.commit()
                except Exception as e:
                    print(e)
                    conn.rollback()
                comment_num += 1
            i += 1
            time.sleep(4)
        else:
            break
```