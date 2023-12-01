export default function Input(props: any) {
  const htmlProps = {
    id: props.name,
    name: props.name,
    type: props.type,
    required: props.required,
    onChange: props.onChange,
    onBlur: props.onBlur,
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled,
  };
  return (
    <label className="block" htmlFor={props.name}>
      {props.label}
      <input
        {...htmlProps}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      {props.helpText && (
        <p className="block text-slate-700 text-sm mt-5" id="email-description">
          {props.helpText}
        </p>
      )}
    </label>
  );
}
