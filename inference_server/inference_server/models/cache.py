import random


class Cache:
    def __init__(self, num_items=100):
        self.dic = {}
        self.num_items = num_items

    def set(self, key, value):
        self.dic[key] = value
        if len(self.dic) > self.num_items:
            del_key = random.choice(list(self.dic.keys()))
            del self.dic[del_key]

    def get(self, key):
        return self.dic.get(key)
