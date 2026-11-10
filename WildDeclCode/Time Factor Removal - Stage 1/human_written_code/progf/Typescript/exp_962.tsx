var GetServerSideProps = require('next').GetServerSideProps;
var FC = require('react').FC;
var Team = require('../xata').Team;

type Props = {
  teams: (Team & { id: string })[];
};

const Signup: FC<Props> = function ({ teams }) {
  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" required />
      </label>
      <label>
        Email
        <input type="email" required />
      </label>
      <label>
        Age
        <input type="number" required />
      </label>
      <label>
        A photo of you
        <input type="file" required />
      </label>
      <label>
        Nickname
        <input type="text" required />
      </label>
      <label>
        Pronouns
        <input type="text" required />
      </label>
      <label>
        Team
        <select>
          {teams.map((team) => {
            return (
              <option id={team.id} value={team.id}>
                {team.name}
              </option>
            );
          })}
        </select>
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
};

module.exports = Signup;

var NextApiHandler = require('next').NextApiHandler;
var XataClient = require('../xata').XataClient;

const client = new XataClient({
  databaseURL: "https://xata-learning-fvmet3.xata.sh/db/home",
  apiKey: process.env.XATA_API_KEY,
});

const getServerSideProps: GetServerSideProps<Props> = async function ({
  query,
}) {
  var filter = query.filter;
  const data = filter
    ? await client.db.teams
        .filter({ name: { $contains: String(filter) } })
        .getAll()
    : await client.db.teams.getAll();

  return {
    props: { teams: data },
  };
};
