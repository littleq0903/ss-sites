import tornado.ioloop
import tornado.web
from tornado import websocket

GLOBALS={
    'sockets': []
}
PORT = 8888


class ClientSocket(websocket.WebSocketHandler):
    def open(self):
        GLOBALS['sockets'].append(self)
        print "WebSocket opened"

    def on_message(self, message):
        print 'received message: %s' % message
        for client in GLOBALS['sockets']:
            client.write_message(message)

    def on_close(self):
        print "WebSocket closed"
        GLOBALS['sockets'].remove(self)


application = tornado.web.Application([
    (r"/socket", ClientSocket)
])

if __name__ == "__main__":
    print 'Starting server on %s' % PORT
    application.listen(PORT)
    tornado.ioloop.IOLoop.instance().start()
