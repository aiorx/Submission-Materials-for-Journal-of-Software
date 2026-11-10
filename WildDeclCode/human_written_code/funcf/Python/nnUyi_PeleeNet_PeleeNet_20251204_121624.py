```python
def build_model(self):
    self.input_train = tf.placeholder(tf.float32, [self.batchsize, self.input_height, self.input_width, self.input_channel], name='input_train')
    self.input_test = tf.placeholder(tf.float32, [self.batchsize, self.input_height, self.input_width, self.input_channel], name='input_test')
    self.one_hot_train = tf.placeholder(tf.float32, [self.batchsize, self.num_class], name='one_hot_train')
    self.keep_prob = tf.placeholder(tf.float32, name='keep_prob')
    self.is_training = tf.placeholder(tf.bool, name='is_training')

    self.logits_train = self.peleenet(self.input_train, is_training=True, reuse=False)
    self.logits_test = self.peleenet(self.input_test, is_training=False, reuse=True)

    self.loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits_v2(labels=self.one_hot_train, logits=self.logits_train))
    self.optimizer = tf.train.AdamOptimizer(learning_rate=self.config.learning_rate).minimize(self.loss)

    correct_pred = tf.equal(tf.argmax(self.logits_test, 1), tf.argmax(self.one_hot_train, 1))
    self.accuracy = tf.reduce_mean(tf.cast(correct_pred, tf.float32))
```