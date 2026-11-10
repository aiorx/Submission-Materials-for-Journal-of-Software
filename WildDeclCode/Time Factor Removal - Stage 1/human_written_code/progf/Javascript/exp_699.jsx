var _import = require('react');
var Head = require('next/head');
var useRouter = require('next/router').useRouter;
var withStyles = require('@mui/styles').withStyles;
var Grid = require('@mui/material').Grid;
var Container = require('@mui/material').Container;
var Button = require('@mui/material').Button;
var TextField = require('@mui/material').TextField;
import {
  Add as AddIcon
} from '@mui/icons-material';

import { Header, Section, CharacterBox, AddBox,
  CreateCharacterModal, ConfirmationModal, EditableRow,
  AttributeModal, SkillModal
} from '../../components';

var api = require('../../utils').api;
var useModal = require('../../hooks/useModal');

var prisma = require('../../database').prisma;

const getServerSideProps = async function () {
  function parseConfigs(array) {
    return array.map(config => {
      if(config.name === 'DICE_ON_SCREEN_TIMEOUT_IN_MS' || 'TIME_BETWEEN_DICES_IN_MS') {
        return {
          ...config,
          value: parseInt(config.value) / 1000
        }
      }

      return config;
    });
  }

  const characters = await prisma.character.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });

  const attributes = await prisma.attribute.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });

  const skills = await prisma.skill.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });

  const configs = await prisma.config.findMany();

  const serializedCharacters = JSON.parse(JSON.stringify(characters));
  const serializedAttributes = JSON.parse(JSON.stringify(attributes));
  const serializedSkills = JSON.parse(JSON.stringify(skills));
  const serializedConfigs = JSON.parse(JSON.stringify(parseConfigs(configs)));

  return {
    props: {
      characters: serializedCharacters,
      attributes: serializedAttributes,
      skills: serializedSkills,
      configs: serializedConfigs
    },
  };
}

function Dashboard({
  classes,

  characters,
  attributes,
  skills,
  configs
}) {
  const router = useRouter();

  const [updatedConfigs, setUpdatedConfigs] = useState({
    DICE_ON_SCREEN_TIMEOUT_IN_MS: null,
    TIME_BETWEEN_DICES_IN_MS: null
  });

  useEffect(function () {
    configs.forEach(config => {
      setUpdatedConfigs(prevState => ({
        ...prevState,
        [config.name]: config.value
      }));
    });
  }, [configs]);

  const refreshData = function () {
    return router.replace(router.asPath);
  }

  const updateConfigs = function () {
    api.put('/config/DICE_ON_SCREEN_TIMEOUT_IN_MS', {
      value: "" + (parseInt(updatedConfigs.DICE_ON_SCREEN_TIMEOUT_IN_MS) * 1000) + ""
    });

    api.put('/config/TIME_BETWEEN_DICES_IN_MS', {
      value: "" + (parseInt(updatedConfigs.TIME_BETWEEN_DICES_IN_MS) * 1000) + ""
    });
  }

  const runInitialSetup = function () {
    api.post('/setup')
      .then(res => {
        if(res.data.success) {
          return window.location.reload();
        }
      });
  }

  const confirmationModal = useModal(function ({ close, custom }) { return (
    <ConfirmationModal
      title={custom.title}
      text={custom.text}
      data={custom.data}
      handleClose={close}
      onConfirmation={(data) => {
        var id = data.id;
var type = data.type;

        api
          .delete("/" + (type) + "/" + (id) + "")
          .then(() => {
            refreshData();
          })
          .catch(() => {
            alert("Erro ao apagar: " + (type) + "");
          });
      }}
    />
  ); });

  const createCharacterModal = useModal(function ({ close }) { return (
    <CreateCharacterModal
      handleClose={close}
      onCharacterCreated={() => {
        refreshData();
      }}
    />
  ); });

  const attributeModal = useModal(function ({ close, custom }) { return (
    <AttributeModal
      handleClose={close}
      data={custom.data || null}
      onSubmit={() => {
        refreshData();
      }}
      operation={custom.operation}
    />
  ); });

  const skillModal = useModal(function ({ close, custom }) { return (
    <SkillModal
      handleClose={close}
      data={custom.data || null}
      onSubmit={() => {
        refreshData();
      }}
      operation={custom.operation}
    />
  ); });

  return (
    <>
      <Container maxWidth="lg" style={{ marginBottom: '30px' }}>
        <Head>
          <title>Dashboard do Mestre | RPG</title>
        </Head>

        <Grid container item spacing={3}>
          <Header title="Dashboard do Mestre" />

          {
            configs.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <Section
                    title="Fichas e personagens"
                  >
                    <Grid item container xs={12} spacing={3}>
                      {characters.map(function (character, index) { return (
                        <Grid item xs={12} md={4} key={index}>
                          <CharacterBox
                            character={character}
                            deleteCharacter={() =>
                              confirmationModal.appear({
                                title: 'Apagar personagem',
                                text: 'Deseja apagar este personagem?',
                                data: { id: character.id, type: 'character' },
                              })
                            }
                          />
                        </Grid>
                      ); })}
                      <Grid item xs={12} md={4}>
                        <AddBox onClick={function () { return createCharacterModal.appear(); }} />
                      </Grid>
                    </Grid>
                  </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Section
                    title="Atributos"
                    renderButton={function () { return (
                      <Button
                        variant="outlined"
                        style={{
                          display: 'flex',
                          alignSelf: 'center',
                        }}
                        onClick={() => attributeModal.appear({ operation: 'create' })}
                      >
                        <AddIcon />
                      </Button>
                    ); }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={2}
                      className={classes.scrollableBox}
                    >
                      {attributes.map(function (attribute, index) { return (
                        <Grid item xs={12} key={index}>
                          <EditableRow
                            data={attribute}
                            editRow={(data) => {
                              attributeModal.appear({ operation: 'edit', data });
                            }}
                            deleteRow={(data) => {
                              confirmationModal.appear({
                                title: 'Apagar atributo',
                                text: 'Deseja apagar este atributo?',
                                data: { id: data.id, type: 'attribute' },
                              });
                            }}
                          />
                        </Grid>
                      ); })}
                    </Grid>
                  </Section>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Section
                    title="Perícias"
                    renderButton={function () { return (
                      <Button
                        variant="outlined"
                        style={{
                          display: 'flex',
                          alignSelf: 'center',
                        }}
                        onClick={() => skillModal.appear({ operation: 'create' })}
                      >
                        <AddIcon />
                      </Button>
                    ); }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={2}
                      className={classes.scrollableBox}
                    >
                      {skills.map(function (skill, index) { return (
                        <Grid item xs={12} key={index}>
                          <EditableRow
                            data={skill}
                            editRow={(data) => {
                              skillModal.appear({ operation: 'edit', data })
                            }}
                            deleteRow={(data) => {
                              confirmationModal.appear({
                                title: 'Apagar perícia',
                                text: 'Deseja apagar esta perícia?',
                                data: { id: data.id, type: 'skill' },
                              });
                            }}
                          />
                        </Grid>
                      ); })}
                    </Grid>
                  </Section>
                </Grid>

                <Grid item xs={12}>
                  <Section
                    title="Configurações"
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={2}
                    >
                        <Grid container spacing={2} item xs={12}>
                          <Grid item xs={12}>
                            <h4>Integração com OBS</h4>
                          </Grid>

                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Tempo do dado em tela"
                              helperText="Em segundos"
                              value={updatedConfigs.DICE_ON_SCREEN_TIMEOUT_IN_MS}
                              onChange={function (e) {
                                const value = e.target.value;

                                setUpdatedConfigs(prevState => ({
                                  ...prevState,
                                  DICE_ON_SCREEN_TIMEOUT_IN_MS: value
                                }));
                              }}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Tempo entre cada dado"
                              helperText="Em segundos"
                              value={updatedConfigs.TIME_BETWEEN_DICES_IN_MS}
                              onChange={function (e) {
                                const value = e.target.value;

                                setUpdatedConfigs(prevState => ({
                                  ...prevState,
                                  TIME_BETWEEN_DICES_IN_MS: value
                                }));
                              }}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <Button variant="contained" onClick={updateConfigs}>
                              Salvar
                            </Button>
                          </Grid>
                        </Grid>
                    </Grid>
                    </Section>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                  <Button variant="contained" onClick={runInitialSetup} fullWidth>
                    REALIZAR CONFIGURAÇÃO INICIAL
                  </Button>
              </Grid>
            )
          }
        </Grid>
      </Container>
    </>
  );
}

const styles = function (theme) { return ({
  scrollableBox: {
    overflow: 'auto',
    maxHeight: '300px',
    paddingRight: '10px',
  },
}); };

module.exports = withStyles(styles)(Dashboard);
