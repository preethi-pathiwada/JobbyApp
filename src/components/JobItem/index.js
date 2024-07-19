import {BsFillStarFill, BsBag} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import {IoLocation} from 'react-icons/io5'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
    packagePerAnnum,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job-item">
        <div className="container">
          <div className="common-con">
            <img
              src={companyLogoUrl}
              className="company-logo"
              alt="company logo"
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
                <p className="icon-text">{location}</p>
              </div>
              <div className="common-container">
                <BsBag className="item-icon" />
                <p className="icon-text">{employmentType}</p>
              </div>
            </div>
            <p className="description">{packagePerAnnum}</p>
          </div>
        </div>
        <div className="content-container">
          <h1 className="title">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
