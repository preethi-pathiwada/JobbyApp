import {BsFillStarFill, BsBag} from 'react-icons/bs'

import {IoLocation} from 'react-icons/io5'

import './index.css'

const SimilarJobItem = props => {
  const {details} = props
  const {
    companyLogoUrl,
    title,
    rating,
    jobDescription,
    location,
    employmentType,
  } = details
  return (
    <li className="similar-job-item">
      <div className="container">
        <div className="common-con">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="similar job company logo"
          />
          <div className="">
            <h1 className="title">{title}</h1>
            <div className="common-con">
              <BsFillStarFill className="star-icon" />
              <p className="description">{rating}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content-container">
        <h1 className="job-title">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </div>
      <div className="location-container ">
        <div className="common-container">
          <div className="common-container">
            <IoLocation className="item-icon" />
            <p className="icon-text">{location}</p>
          </div>
          <div className="common-container">
            <BsBag className="item-icon" />
            <p className="icon-text">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
