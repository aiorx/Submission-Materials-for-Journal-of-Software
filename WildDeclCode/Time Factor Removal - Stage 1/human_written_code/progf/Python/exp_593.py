
from fastecdsa import keys, curve, ecdsa
from fastecdsa.point import Point

from misocoin.hashing import sha1


def get_new_priv_key() :
    '''
    Returns a random private key in hex format
    '''
    return '{:x}'.format(keys.gen_private_key(curve.P256))


def get_pub_key(priv_key) :
    '''
    Returns the public key associated with
    the private key. 'x' is used to split
    up the x and y coordinates of the public
    key
    '''
    pub_key = keys.get_public_key(int(priv_key, 16), curve.P256)
    return '{:x}'.format(pub_key.x) + 'x' + '{:x}'.format(pub_key.y)


def get_address(pub_key) :
    '''
    Given the public key, return the address (just SHA1 it
    to shorten it)
    '''
    return sha1(pub_key)


def sign_msg(msg, priv_key) :
    '''
    Given a message, and the private key,
    return the signature (in hex). x, and y are joined
    with 'x'
    '''
    r, s = ecdsa.sign(msg, int(priv_key, 16))
    return '{:x}x{:x}'.format(r, s)


def pub_key_to_point(pub_key) :
    '''
    Given a public key, return a Point object
    (Used to verify signatures)
    '''
    xs, ys = pub_key.split('x')
    return Point(int(xs, 16), int(ys, 16), curve=curve.P256)


def is_sig_valid(signature, pub_key, msg) :
    '''
    Given a signature, public key, and a message,
    check if the signature is valid
    '''
    r, s = signature.split('x')
    p = pub_key_to_point(pub_key)
    return ecdsa.verify((int(r, 16), int(s, 16)), msg, p)
