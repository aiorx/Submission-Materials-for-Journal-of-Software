export const searchID = async (req, res) => {
  try {
    // Request params validation schema
    const paramsSchema = yup.object({
      id: yup
        .string()
        .required()
        .test('mongoID', 'Invalid ID', (value) => {
          return validator.isMongoId(value)
        }),
    })
    // Parsed request params
    const parsedParams = await paramsSchema.validate(req.params, { stripUnknown: true })

    // Assisted using common GitHub development utilities Chat using Claude 3.7 Sonnet Model
    const result = await setlists.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(parsedParams.id),
        },
      },
      { $unwind: '$selectablePatterns' },
      {
        $lookup: {
          from: 'patterns',
          localField: 'selectablePatterns.pattern',
          foreignField: '_id',
          as: 'selectablePatternData',
        },
      },
      { $unwind: '$selectablePatternData' },
      {
        $addFields: {
          selectablePatterns: {
            $mergeObjects: [
              '$selectablePatternData',
              {
                difficulty: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$selectablePatternData.difficulties',
                        as: 'difficulty',
                        cond: { $eq: ['$$difficulty._id', '$selectablePatterns.difficulty'] },
                      },
                    },
                    0,
                  ],
                },
              },
            ],
          },
        },
      },
      { $unset: ['selectablePatterns.difficulties'] },
      {
        $group: {
          _id: '$_id',
          root: { $first: '$$ROOT' },
          selectablePatterns: { $push: '$selectablePatterns' },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$root', { selectablePatterns: '$selectablePatterns' }],
          },
        },
      },
      { $unwind: '$hiddenPatterns' },
      {
        $lookup: {
          from: 'patterns',
          localField: 'hiddenPatterns.pattern',
          foreignField: '_id',
          as: 'hiddenPatternData',
        },
      },
      { $unwind: '$hiddenPatternData' },
      {
        $addFields: {
          hiddenPatterns: {
            $mergeObjects: [
              '$hiddenPatternData',
              {
                difficulty: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$hiddenPatternData.difficulties',
                        as: 'difficulty',
                        cond: { $eq: ['$$difficulty._id', '$hiddenPatterns.difficulty'] },
                      },
                    },
                    0,
                  ],
                },
                criteriaType: '$hiddenPatterns.criteriaType',
                criteriaDirection: '$hiddenPatterns.criteriaDirection',
                criteriaValue: '$hiddenPatterns.criteriaValue',
              },
            ],
          },
        },
      },
      { $unset: ['hiddenPatterns.difficulties'] },
      {
        $group: {
          _id: '$_id',
          submitter: { $first: '$submitter' },
          name: { $first: '$name' },
          link: { $first: '$link' },
          previews: { $first: '$previews' },
          description: { $first: '$description' },
          image: { $first: '$image' },
          control: { $first: '$control' },
          selectablePatterns: { $first: '$selectablePatterns' },
          hiddenPatterns: { $push: '$hiddenPatterns' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'pattern',
          as: 'comments',
          pipeline: [{ $project: { setlist: 0 } }],
        },
      },
      {
        $addFields: {
          rating: {
            count: { $size: '$comments' },
            avg: { $ifNull: [{ $avg: '$comments.rating' }, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'submitter',
          foreignField: '_id',
          as: 'submitter',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      { $unwind: '$submitter' },
      { $unset: ['comments', 'webhook'] },
    ])

    // Note:
    // Aggregation returns an array, but we only need the first element
    if (!result || result.length === 0) {
      throw new mongoose.Error.DocumentNotFoundError()
    }

    res.status(200).send({ success: true, message: '', result: result[0] })
  } catch (error) {
    handleServerError(error)
    if (error.name === 'ValidationError') {
      res.status(400).send({ success: false, message: 'Validation Failed' })
    } else if (error.name === 'CastError' || error.name === 'DocumentNotFoundError') {
      res.status(404).send({ success: false, message: 'Not found' })
    } else {
      res.status(500).send({ success: false, message: 'Server Error' })
    }
  }
}