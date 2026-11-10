var React = require('react');
var Image = require('@components/DataDisplay/Image').Image;
var Title = require('@components/DataDisplay/Title').Title;
var Text = require('@components/DataDisplay/Text').Text;
var Spacing = require('@components/Layout/Spacing').Spacing;
var BookmarkOutlined = require('@components/Icon/BookmarkOutlined').BookmarkOutlined;
var AspectRatio = require('@components/Layout/AspectRatio').AspectRatio;
var Truncate = require('../Truncate').Truncate;
var ISerie = require('@globalTypes/serieServices').Serie;
var Component = require('@globalTypes/component').Component;
var SerieBox = require('./styled').SerieBox;
var ThumbnailBox = require('./styled').ThumbnailBox;
var BookmarkBox = require('./styled').BookmarkBox;

const Serie: Component<SerieTypeMap> = function ({
  name,
  thumbnail,
  geners,
  countEpisodes,
  isInQueue,
  ...rest
}) {
  return (
    <SerieBox {...rest}>
      {isInQueue && (
        <BookmarkBox>
          <BookmarkOutlined colorScheme='white' />
        </BookmarkBox>
      )}
      <ThumbnailBox>
        <AspectRatio ratio='2:3'>
          <Image src={thumbnail} />
        </AspectRatio>
      </ThumbnailBox>
      <Spacing size={16} />
      <div>
        <Truncate>
          <Title level='6' colorScheme='white'>
            {name.toUpperCase()}
          </Title>
        </Truncate>
        {Array.isArray(geners) && (
          <Truncate>
            <Text colorScheme='secondary'>
              {geners.map((gener) => gener).join(', ')}
            </Text>
          </Truncate>
        )}
        <Text colorScheme='secondary'>
          {"" + (countEpisodes) + " " + (countEpisodes === 1 ? 'Video' : 'Videos') + ""}
        </Text>
      </div>
    </SerieBox>
  );
};

type SerieTypeMap = {
  props: {
    name: string;
    thumbnail: string;
    countEpisodes: number;
    geners: ISerie['geners'];
    isInQueue?: boolean;
  };
  element: 'div';
};
