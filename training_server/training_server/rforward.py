import socket
import select
import threading
import paramiko


def handler(chan, host, port):
    sock = socket.socket()
    try:
        sock.connect((host, port))
    except Exception as e:
        verbose("Forwarding request to %s:%d failed: %r" % (host, port, e))
        return

    verbose("Connected!  Tunnel open %r -> %r -> %r" % (chan.origin_addr, chan.getpeername(), (host, port)))
    while True:
        r, w, x = select.select([sock, chan], [], [])
        if sock in r:
            data = sock.recv(1024)
            if len(data) == 0:
                break
            chan.send(data)
        if chan in r:
            data = chan.recv(1024)
            if len(data) == 0:
                break
            sock.send(data)
    chan.close()
    sock.close()
    verbose("Tunnel closed from %r" % (chan.origin_addr,))


def reverse_forward_tunnel(server_port, remote_host, remote_port, transport):
    transport.request_port_forward("", server_port)
    while True:
        chan = transport.accept(1000)
        if chan is None:
            continue
        thr = threading.Thread(target=handler, args=(chan, remote_host, remote_port))
        thr.setDaemon(True)
        thr.start()


def verbose(s):
    print(s)


def forward(
    server_host,
    server_port,
    remote_host,
    remote_port,
    forwarded_port,
    username,
    password,
):
    server = (server_host, server_port)
    remote = (remote_host, remote_port)

    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.WarningPolicy())

    verbose("Connecting to ssh host %s:%d ..." % (server[0], server[1]))
    try:
        client.connect(
            server[0],
            server[1],
            username=username,
            password=password,
        )
    except Exception as e:
        print("*** Failed to connect to %s:%d: %r" % (server[0], server[1], e))

    verbose("Now forwarding remote port %d to %s:%d ..." % (forwarded_port, remote[0], remote[1]))

    try:
        transport = client.get_transport()
        transport.set_keepalive(30)
        reverse_forward_tunnel(forwarded_port, remote[0], remote[1], client.get_transport())
    except KeyboardInterrupt:
        print("C-c: Port forwarding stopped.")


def forward_in_thread(
    server_host,
    server_port,
    remote_host,
    remote_port,
    forwarded_port,
    username,
    password,
):
    thr = threading.Thread(
        target=forward,
        args=(
            server_host,
            server_port,
            remote_host,
            remote_port,
            forwarded_port,
            username,
            password,
        ),
    )
    thr.start()
