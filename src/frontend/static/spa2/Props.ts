// A flat object of key-value pairs, where the key is the name of a view parameter and the value is the value of that view parameter.
// Example: {id: "123", comment_id: "456"}
export default interface Props {
    [key: string]: string;
}
