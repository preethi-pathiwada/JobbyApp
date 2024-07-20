import {BsFillStarFill, BsBag} from 'react-icons/bs'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {IoLocation} from 'react-icons/io5'
import {RiShareBoxFill} from 'react-icons/ri'

import Cookies from 'js-cookie'
import SimilarJobItem from '../SimilarJobItem'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {data: null, apiStatus: 'inProgress'}

  componentDidMount() {
    this.getJobDetails()
  }

  similarJobsPascalCase = obj => ({
    id: obj.id,
    title: obj.title,
    companyLogoUrl: obj.company_logo_url,
    jobDescription: obj.job_description,
    location: obj.location,
    rating: obj.rating,
    employmentType: obj.employment_type,
  })

  skills = obj => ({
    name: obj.name,
    imageUrl: obj.image_url,
  })

  pascalCaseLifeAtCompany = obj => ({
    description: obj.description,
    imageUrl: obj.image_url,
  })

  convertToPascalCase = obj => ({
    id: obj.id,
    companyLogoUrl: obj.company_logo_url,
    companyWebsiteUrl: obj.company_website_url,
    employmentType: obj.employment_type,
    jobDescription: obj.job_description,
    lifeAtCompany: this.pascalCaseLifeAtCompany(obj.life_at_company),
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    title: obj.title,
    skills: obj.skills.map(eachObj => this.skills(eachObj)),
  })

  getJobDetails = async () => {
    console.log('clicked')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${Cookies.get('jwt_token')}`},
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        jobDetails: this.convertToPascalCase(data.job_details),
        similarJobs: data.similar_jobs.map(eachObj =>
          this.similarJobsPascalCase(eachObj),
        ),
      }
      this.setState({data: updatedData, apiStatus: 'success'})
    } else {
      this.setState({apiStatus: 'failed'})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemResult = () => {
    const {data} = this.state
    const {jobDetails, similarJobs} = data
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      jobDescription,
      packagePerAnnum,
      skills,
      lifeAtCompany,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany

    if (data !== null) {
      return (
        <>
          <div className="job-item">
            <div className="container">
              <div className="common-con">
                <img
                  src={companyLogoUrl}
                  className="company-logo"
                  alt="job details company logo"
                />
                <div className="">
                  <h1 className="title">{title}</h1>
                  <div className="common-con">
                    <BsFillStarFill className="star-icon" />
                    <p className="description">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-container ">
                <div className="common-con">
                  <div className="common-container">
                    <IoLocation className="item-icon" />
                    <p className="description">{location}</p>
                  </div>
                  <div className="common-container">
                    <BsBag className="item-icon" />
                    <p className="description">{employmentType}</p>
                  </div>
                </div>
                <p className="job-description">{packagePerAnnum}</p>
              </div>
            </div>
            <div className="content-container">
              <div className="location-container">
                <h1 className="job-title">Description</h1>
                <div>
                  <a href={companyWebsiteUrl}>
                    <div className="common-container">
                      <p>Visit</p>
                      <RiShareBoxFill />
                    </div>
                  </a>
                </div>
              </div>
              <p className="job-description">{jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1 className="title">Skills</h1>
              <ul className="skills-list-container">
                {skills.map(obj => (
                  <li
                    className="skill-item-container"
                    key={`${obj.name}-${obj.name}[0]`}
                  >
                    <img
                      src={obj.imageUrl}
                      className="skill-image"
                      alt={obj.name}
                    />
                    <p className="job-description">{obj.name}</p>
                  </li>
                ))}
              </ul>
              <div className="some-container">
                <div>
                  <h1 className="job-title">Life At Company</h1>
                  <p className="job-description">{description}</p>
                </div>
                <img
                  src={imageUrl}
                  className="company-image"
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <h1 className="job-title">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobs.map(eachObj => (
              <SimilarJobItem key={eachObj.id} details={eachObj} />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="title">Oops! Something Went Wrong</h1>
      <p className="icon-text">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="shop-now-button"
        onClick={() => {
          this.setState({apiStatus: 'inProgress'}, this.getJobDetails)
        }}
      >
        Retry
      </button>
    </div>
  )

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'inProgress':
        return this.renderLoader()
      case 'success':
        return this.renderJobItemResult()
      case 'failed':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-item">{this.renderDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
