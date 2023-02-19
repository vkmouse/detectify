import os
import threading
import time


class FileWatcher:
    def __init__(self, file_path: str, on_change_callback, monitor_interval=1):
        self.file_path = file_path
        self.on_change_callback = on_change_callback
        self.monitor_interval = monitor_interval
        self.file_stats = FileStats(self.file_path)
        self.running = False

    def watch(self):
        while self.running:
            current_stats = FileStats(self.file_path)
            if self.file_stats != current_stats:
                self.file_stats = current_stats
                try:
                    self.on_change_callback()
                except Exception as e:
                    print(f"Error in callback function: {e}")
            time.sleep(self.monitor_interval)

    def start(self):
        self.running = True
        t = threading.Thread(target=self.watch)
        t.start()

    def stop(self):
        self.running = False


class FileStats:
    def __init__(self, file_path: str):
        self.file_path = file_path
        try:
            file_stats = os.stat(self.file_path)
            self.file_stats = file_stats
            self.file_size = file_stats.st_size
            self.last_modified_time = file_stats.st_mtime
        except FileNotFoundError:
            self.file_stats = None
            self.file_size = None
            self.last_modified_time = None

    def __eq__(self, that):
        if not isinstance(that, FileStats):
            return False
        return (
            self.file_path == that.file_path
            and self.file_stats == that.file_stats
            and self.file_size == that.file_size
            and self.last_modified_time == that.last_modified_time
        )
