
var useState = require('react').useState;
var View = require('react-native').View;
var Text = require('react-native').Text;
var StyleSheet = require('react-native').StyleSheet;
var TextInput = require('react-native').TextInput;
var useForm = require('react-hook-form').useForm;
var Controller = require('react-hook-form').Controller;
var PressableText = require('./styled/PressableText').PressableText;

export type ExerciseFormData = {
  name: string,
  duration: string,
  type: string,
  reps?: string
}

type WorkoutProps = {
  onSubmit: function (form: ExerciseFormData) { return void; }}

const selectionItems = ["exercise", "break", "stretch"]

module.exports = function ExerciseForm({;
  onSubmit
}: WorkoutProps) {
  var control = useForm.control;
var handleSubmit = useForm.handleSubmit;();
  const [ isSelectionOn, setSelectionOn ] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.rowContainer}>
          <Controller
            control={control}
            rules={{
              required: true
            }}
            name="name"
            render={function ({ field: {onChange, value}}) { return <TextInput
                onChangeText={onChange}
                value={value}
                style={styles.input}
                placeholderTextColor={"rgba(0,0,0,0.4)"}
                placeholder="Name"
              />; }}
          />
          <Controller
            control={control}
            rules={{
              required: true
            }}
            name="duration"
            render={function ({ field: {onChange, value}}) { return <TextInput
                onChangeText={onChange}
                value={value}
                style={styles.input}
                placeholderTextColor={"rgba(0,0,0,0.4)"}
                placeholder="Duration"
              />; }}
          />
        </View>
        <View style={styles.rowContainer}>
          <Controller
            control={control}
            name="reps"
            render={function ({ field: {onChange, value}}) { return <TextInput
                onChangeText={onChange}
                value={value}
                style={styles.input}
                placeholderTextColor={"rgba(0,0,0,0.4)"}
                placeholder="Repetitions"
              />; }}
          />
          <Controller
            control={control}
            rules={{
              required: true
            }}
            name="type"
            render={function ({ field: {onChange, value}}) { return <View style={{flex: 1}}>
                { isSelectionOn ?
                  <View>
                    { selectionItems.map(selection =>
                      <PressableText
                        key={selection}
                        style={styles.selection}
                        text={selection}
                        onPressIn={() => {
                          onChange(selection)
                          setSelectionOn(false)}
                        }
                      />
                    )}
                  </View> :
                  <TextInput
                    onPressIn={() => setSelectionOn(true)}
                    style={styles.input}
                    value={value}
                    placeholderTextColor={"rgba(0,0,0,0.4)"}
                    placeholder="Type"
                  />
                }
              </View>; }}
          />
        </View>
        <PressableText
          style={{marginTop: 10}}
          text="Add Exercise"
          onPress={handleSubmit(function (data) {
            onSubmit(data as ExerciseFormData);
          })}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10
  },
  input: {
    flex: 1,
    margin: 2,
    borderWidth: 1,
    height: 30,
    padding: 5,
    borderRadius: 5,
    borderColor: "rgba(0,0,0, 0.4)",
  },
  rowContainer: {
    flexDirection: "row"
  },
  selection: {
    margin: 2,
    padding: 3,
    alignSelf: "center"
  }
})
