var Button = require('@nextui-org/react').Button;
var Divider = require('@nextui-org/react').Divider;
var Input = require('@nextui-org/react').Input;
var Modal = require('@nextui-org/react').Modal;
var Text = require('@nextui-org/react').Text;
var React = require('react');
var Flex = require('../styles/flex').Flex;

const AddUser = function () {
   const [visible, setVisible] = React.useState(false);
   const handler = () => setVisible(true);

   const closeHandler = () => {
      setVisible(false);
      console.log('closed');
   };

   return (
      <div>
         <Button auto onClick={handler}>
            Add User
         </Button>
         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="600px"
            open={visible}
            onClose={closeHandler}
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Add new user
               </Text>
            </Modal.Header>
            <Divider css={{my: '$5'}} />
            <Modal.Body css={{py: '$10'}}>
               <Flex
                  direction={'column'}
                  css={{
                     'flexWrap': 'wrap',
                     'gap': '$8',
                     '@lg': {flexWrap: 'nowrap', gap: '$12'},
                  }}
               >
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="First Name"
                        bordered
                        clearable
                        fullWidth
                        size="lg"
                        placeholder="First Name"
                     />
                     <Input
                        label="Last Name"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Last Name"
                     />
                  </Flex>

                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Email"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Email"
                     />
                     <Input
                        label="Phone Number"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Phone Number"
                     />
                  </Flex>
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Department"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Department"
                     />
                     <Input
                        label="Company"
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Company"
                     />
                  </Flex>
               </Flex>
            </Modal.Body>
            <Divider css={{my: '$5'}} />
            <Modal.Footer>
               <Button auto onClick={closeHandler}>
                  Add User
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};
