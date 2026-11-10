var Loader = require('@mantine/core').Loader;
var redirect = require('@remix-run/node').redirect;
var Form = require('@remix-run/react').Form;
var useEffect = require('react').useEffect;
var useRef = require('react').useRef;
var useState = require('react').useState;
var db = require('~/utils/db.server').db;

const action: ActionFunction = async function ({ request, params }) {
  const track = await db.track.findUnique({
    where: { trackId: params.trackId },
    select: {
      redirectUrl: true,
      id: true,
    },
  });

  if (!track) {
    throw new Error("Track " + (params.trackId) + " does not exist");
  }

  const form = await request.formData();
  const ip = form.get("ip");

  if (typeof ip !== "string") {
    throw new Error("Missing user data");
  }

  const userAgent = request.headers.get("user-agent");

  if (typeof userAgent !== "string") {
    throw new Error("Missing user data");
  }

  const fields = { userAgent, ip, trackId: track.id };

  await db.click.create({ data: fields });

  return redirect(track.redirectUrl);
};

module.exports = function TrackRoute() {;
  const [ip, setIp] = useState();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(function () {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((res) => {
        setIp(res.ip);
      });
  }, []);

  useEffect(function () {
    if (ip) {
      formRef.current?.submit();
    }
  }, [ip]);

  return (
    <>
      <Loader />
      <Form ref={formRef} method="post" hidden>
        ip: {ip}
        <input name="ip" defaultValue={ip} />
      </Form>
    </>
  );
}
