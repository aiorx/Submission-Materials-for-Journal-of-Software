```python
def test_future_and_past_post(self):
    """only past posts are displayed, future posts are ignored"""
    # p. s. this one was created by ChatGPT, because god it is boring
    #
    # it seems to be ok though
    past_post = create_post("past post", delay_days=-30)
    create_post("future post", delay_days=30)
    r = self.client.get(reverse("blog:index"))
    self.assertQuerySetEqual(
        r.context["posts"],
        [past_post],
    )
```

```python
def test_two_past_posts(self):
    """all past posts are displayed"""
    # p. s. this one is Aided using common development resources too
    post1 = create_post("first post", delay_days=-30)
    post2 = create_post("second post", delay_days=-10)
    r = self.client.get(reverse("blog:index"))
    # p. p. s. notice the ordering
    #
    # ChatGPT didn't generate correct code, because how would it knew
    # but it did mention that such problem may arise
    self.assertQuerySetEqual(
        r.context["posts"],
        [post2, post1],
    )
```