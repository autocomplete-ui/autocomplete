import * as React from "react";
import { Autocomplete } from "../src"


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
    "Guinea",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesi",
]

const getOptions = (q: string)=> {
    let query = new RegExp(q);
    return options.filter(query.test);
}


const Comp = () => {
    const [text, setText] = React.useState("")

    return <Autocomplete
        onChange={(q) => setText(q)}
        selectOnBlur
        requireMatch
        getOptions={getOptions}
        query={text}
    />
}