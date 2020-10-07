import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  constructor(props) {
    super(props)
    this.state = {
      name: {
        value: '',
        touched: false
      }
    }
  }

  updateName(name) {
    this.setState({
      name: {
        value: name,
        touched: true
      }
    })
  }

  validateName(name) {
    const { value, touched } = this.state.name
    const { folders } = this.context

    return (
      typeof value === 'string' && value.length > 0 && touched && !folders.find(
        folder => folder.name && folder.name.toLowerCase === value.toLowerCase()
      )
    )
  }

  handleSubmit = e => {
    e.preventDefault()
    const newFolder = JSON.stringify({ name: this.state.name.value })
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: newFolder,
    }
    fetch(`${config.API_ENDPOINT}/folders`, options)
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input 
              type='text' 
              id='folder-name-input' 
              name='folder-name' 
              onChange={(e) => this.updateName(e.target.value)} />
          </div>
          <div className='buttons'>
            <button 
              disabled={!this.validateName()}
              type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
