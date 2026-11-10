var React = require('react');

const defaultFormValues = {
  title: '',
  content: '',
}

module.exports = function PostForm({;
  onSubmit,
  initialValues = defaultFormValues,
  submitText,
}) {
  const [values, setValues] = React.useState(initialValues)

  const setValue = function (field, value) { return setValues((old) => ({ ...old, [field]: value }))

  const handleSubmit = (e) => {
    setValues(defaultFormValues)
    e.preventDefault()
    onSubmit(values)
  }

  React.useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <div>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={(e) => setValue('title', e.target.value)}
          required
        />
      </div>
      <br />
      <label htmlFor="content">Content</label>
      <div>
        <textarea
          type="text"
          name="content"
          value={values.content}
          onChange={(e) => setValue('content', e.target.value)}
          required
        />
      </div>
      <br />
      <button type="submit">{submitText}</button>
    </form>
  ); }}
