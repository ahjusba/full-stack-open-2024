import { useState, useEffect } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log("Persons ", persons)
    personsService
      .getAll()
      .then(initialPersons => {
        console.log("Promise fulfilled with data ", initialPersons)
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('Error fetching persons:', error)
      })
  }, [])

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = event => {
    event.preventDefault()

    if (persons.filter(person => person.name === newName).length > 0) {
      const p = persons.find(person => person.name === newName)
      if(window.confirm(`${p.name} is already in the phonebook. Update number?`)){
        updatePerson(p.id)
        setNewName('')
        setNewNumber('')
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personsService
      .add(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
      })

    setNewName('')
    setNewNumber('')

    console.log("Submitted form...")
  }

  const deletePerson = id => {    
    const deletingPerson = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${deletingPerson.name}?`)){
      personsService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const updatePerson = (id) => {
    const updatingPerson = persons.find(person => person.id === id)
    const updatedPerson = {...updatingPerson, number: newNumber}

    personsService
      .update(id, updatedPerson)
      .then(response => setPersons(persons.map(person => person.id !== id ? person : response)))
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Header text='Phonebook' />
      <InputField fieldName='Filter contacts: ' value={filter} handleValueChange={handleFilterChange} />
      <Header text='Add New Contact' />
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}       
      />
      <Header text='Numbers' />
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>        
        <InputField fieldName='name' value={newName} handleValueChange={handleNameChange} />
        <InputField fieldName='number' value={newNumber} handleValueChange={handleNumberChange} />
        <div>
          <button type="submit">
            Add Person          
          </button>
        </div>
      </form>
  )
}

const Header = ({text}) => {
  return (
    <h1>
      {text}
    </h1>
  )
}

const InputField = ({fieldName, value, handleValueChange}) => {
  return (
    <div>
      {fieldName}:
      <input
        value={value}
        onChange={handleValueChange}
      />
    </div>
  )
}

const Persons = ({persons, deletePerson}) => {
  return (
    <ul>
      {persons.map(person => {
          return(
            <Person key={person.id} name={person.name} number={person.number} id={person.id} deletePerson={deletePerson} />
          )
        })}
    </ul>
  )
}

const Person = ({name, number, id, deletePerson}) => {
  return (
    <div>
      <li>
        {name} {number}
        <DeleteButton id={id} deletePerson={deletePerson} />
      </li>
    </div>
  )
}

const DeleteButton = ({id, deletePerson}) => {
  return(
    <button onClick={() => deletePerson(id)}>
      delete
    </button>
  )
} 

export default App