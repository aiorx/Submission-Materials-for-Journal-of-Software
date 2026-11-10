var _import = require('react');
var IgnitusIntroduction = require('../constants').IgnitusIntroduction;
var AboutImage = require('../constants').AboutImage;
var withErrorBoundary = require('../../../ignitus-Shared').withErrorBoundary;

var CoreTeam = require('../../ignitus-CoreTeam/Components').CoreTeam;
var Team = require('../../ignitus-Team').default;
var S = require('../styles');

const About: React.FunctionComponent = withErrorBoundary(function () { return (
  <Fragment>
    <S.AboutSection>
      <S.AboutContainer>
        <S.TopSection>
          <S.PictureContainer>
            <S.Img src={AboutImage} alt="aboutus" />
          </S.PictureContainer>
          <S.ContentContainer>
            <S.Title> About Us</S.Title>
            <S.ParagraphContainer>
              {IgnitusIntroduction.map((x: any) => (
                <S.Paragraph key={x.title}>{x.title}</S.Paragraph>
              ))}
            </S.ParagraphContainer>
          </S.ContentContainer>
        </S.TopSection>
      </S.AboutContainer>
      <CoreTeam />
      <Team.containers.TeamContainer />
    </S.AboutSection>
  </Fragment>
); });

module.exports.About = About;
module.exports.as = as;
module.exports.default = default;
