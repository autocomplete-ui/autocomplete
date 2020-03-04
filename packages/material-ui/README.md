# @Autocomplete/material-ui

Using the react library to implements autocomplete with material-ui library (the most popular material-design with react)

@ Deceleration
Still under construction

## example

```typescript
import { Autocomplete } from "@autocomplete/material-ui";

const options = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina",
    "Burundi",
    "Cabo",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook",
    "Costa",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Côte",
    "Democratic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican",
    "Ecuador",
    "Egypt",
    "El",
    "Equatorial",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Faroe",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesi",
];

const getOptions = (q: string) => {
  let query = new RegExp(q);
  return options.filter(o => query.test(o));
};

const Comp = () => {
  const [text, setText] = React.useState("");

  return (
    <Autocomplete
      onChange={q => setText(q)}
      selectOnBlur
      requireMatch
      getOptions={getOptions}
      query={text}
    />
  );
};
```
