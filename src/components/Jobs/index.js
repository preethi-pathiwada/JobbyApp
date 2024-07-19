import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const CommonComp = ({details, type, name, value, changeFunc}) => {
  const changeCheckbox = event => {
    changeFunc(event)
  }
  return (
    <li className="list-item">
      <input
        type={type}
        className="checkbox"
        name={name}
        id={details.label}
        onChange={changeCheckbox}
        value={value}
      />
      <label htmlFor={details.label} className="category-description">
        {details.label}
      </label>
    </li>
  )
}

class Jobs extends Component {
  state = {
    profileDetails: null,
    profileApiStatus: 'inProgress',
    checkboxList: [],
    packageSelected: '',
    inputValue: '',
    resultsList: [],
    apiStatus: 'inProgress',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.onClickSearch()
  }

  getProfileDetails = async () => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok) {
      const data = await response.json()
      const detailsObj = data.profile_details
      const updatedData = {
        name: detailsObj.name,
        profileImageUrl: detailsObj.profile_image_url,
        shortBio: detailsObj.short_bio,
      }
      this.setState({profileDetails: updatedData, profileApiStatus: 'success'})
    } else {
      this.setState({profileApiStatus: 'failed'})
    }
  }

  onChangeCheckbox = event => {
    console.log(event.target.value)
    const {checkboxList} = this.state
    if (event.target.checked) {
      this.setState(
        prevState => ({
          checkboxList: [...prevState.checkboxList, event.target.value],
        }),
        this.onClickSearch,
      )
    } else {
      const index = checkboxList.indexOf(event.target.value)
      checkboxList.splice(index, 1)
      this.setState({checkboxList}, this.onClickSearch)
    }
  }

  onChangeRadioButton = event => {
    this.setState(
      {packageSelected: event.target.value.toLowerCase()},
      this.onClickSearch,
    )
  }

  onChangeInput = event => {
    this.setState({inputValue: event.target.value.toLowerCase()})
  }

  onClickSearch = async () => {
    const {checkboxList, packageSelected, inputValue} = this.state
    console.log(checkboxList)
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxList.join(
      ',',
    )}&minimum_package=${packageSelected}&search=${inputValue}`
    console.log(url)

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt_token')}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachObj => ({
        id: eachObj.id,
        title: eachObj.title,
        companyLogoUrl: eachObj.company_logo_url,
        jobDescription: eachObj.job_description,
        location: eachObj.location,
        rating: eachObj.rating,
        packagePerAnnum: eachObj.package_per_annum,
        employmentType: eachObj.employment_type,
      }))
      this.setState({resultsList: updatedData, apiStatus: 'success'})
    } else {
      this.setState({apiStatus: 'failed'})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailure = () => (
    <div className="con2">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-bg">
        <div className="profile-container">
          <img
            src={
              profileDetails !== null ? `${profileDetails.profileImageUrl}` : ''
            }
            className="profile-pic"
            alt="profile"
          />
          <h1 className="name">
            {profileDetails !== null ? `${profileDetails.name}` : ''}
          </h1>
          <p className="designation">
            {profileDetails !== null ? `${profileDetails.shortBio}` : ''}
          </p>
        </div>
      </div>
    )
  }

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case 'inProgress':
        return this.renderLoader()
      case 'success':
        return this.renderProfileSuccessView()
      case 'failed':
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderAllJobs = () => {
    const {resultsList} = this.state
    if (resultsList.length === 0) {
      return (
        <div className="results-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <p className="title">No Jobs Found</p>
          <p className="description">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <div className="results-container">
        <ul className="results-list-container">
          {resultsList.map(eachObj => (
            <JobItem key={eachObj.id} jobDetails={eachObj} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
    </div>
  )

  renderJobResults = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'inProgress':
        return this.renderLoader()
      case 'success':
        return this.renderAllJobs()
      case 'failed':
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="overall-jobs-container">
          <div className="jobs-container">
            <div className="con">
              <div className="search-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  onChange={this.onChangeInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-icon-button"
                  onClick={this.onClickSearch}
                  aria-label="Search"
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              <div className="container">{this.renderProfile()}</div>
              <div className="container">
                <h1 className="category-heading">Types of Employment</h1>
                <ul className="list-container">
                  {employmentTypesList.map(eachObj => (
                    <CommonComp
                      key={eachObj.employmentTypeId}
                      details={eachObj}
                      type="checkbox"
                      value={eachObj.employmentTypeId}
                      changeFunc={this.onChangeCheckbox}
                    />
                  ))}
                </ul>
              </div>
              <div className="">
                <h1 className="category-heading">Salary Range</h1>
                <ul className="list-container">
                  {salaryRangesList.map(eachObj => (
                    <CommonComp
                      key={eachObj.salaryRangeId}
                      details={eachObj}
                      type="radio"
                      name="salaryRange"
                      value={eachObj.salaryRangeId}
                      changeFunc={this.onChangeRadioButton}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {this.renderJobResults()}
        </div>
      </>
    )
  }
}

export default Jobs
