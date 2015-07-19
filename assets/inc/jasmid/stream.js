/* Wrapper for accessing strings through sequential reads */
function Stream(str) {
	var stream = {
		position: 0,
		str: str,
		eof: function () {
			return stream.position >= str.length;
		},
		/* read a MIDI-style variable-length integer
		 (big-endian value in groups of 7 bits,
		 with top bit set to signify that another byte follows)
		 */
		readVarInt: function () {
			var result = 0;
			while (true) {
				var b = stream.readInt8();
				if (b & 0x80) {
					result += (b & 0x7f);
					result <<= 7;
				} else {
					/* b is the last byte */
					return result + b;
				}
			}
		}
	};
	if (typeof(str) === 'string') {
		stream.read = function (length) {
			var result = stream.str.substr(stream.position, length);
			stream.position += length;
			return result;
		};
		stream.readInt32 = function () {
			var result = (
				(stream.str.charCodeAt(stream.position) << 24)
				+ (stream.str.charCodeAt(stream.position + 1) << 16)
				+ (stream.str.charCodeAt(stream.position + 2) << 8)
				+ stream.str.charCodeAt(stream.position + 3));
			stream.position += 4;
			return result;
		};
		stream.readInt16 = function () {
			var result = (
			(stream.str.charCodeAt(stream.position) << 8)
			+ stream.str.charCodeAt(stream.position + 1));
			stream.position += 2;
			return result;
		};
		stream.readInt8 = function (signed) {
			var result = stream.str.charCodeAt(stream.position);
			if (signed && result > 127) result -= 256;
			stream.position += 1;
			return result;
		};
	} else if (str instanceof ArrayBuffer) {
		stream.dv = new DataView(str);
		stream.read = function (length) {
			var result = String.fromCharCode.apply(null, new Uint8Array(stream.str, stream.position, length));
			stream.position += length;
			return result;
		};
		stream.readInt32 = function () {
			var result = stream.dv.getInt32(stream.position);
			stream.position += 4;
			return result;
		};
		stream.readInt16 = function () {
			var result = stream.dv.getInt16(stream.position);
			stream.position += 2;
			return result;
		};
		stream.readInt8 = function (signed) {
			var result = signed ? stream.dv.getInt8(stream.position) : stream.dv.getUint8(stream.position);
			stream.position += 1;
			return result;
		};
	}
	return stream;
}