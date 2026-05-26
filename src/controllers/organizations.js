import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
} from '../models/organizations.js';

import {
  getProjectsByOrganizationId
} from '../models/projects.js';

import {
  body,
  validationResult
} from 'express-validator';


// ===============================
// HELPER: ERROR PAGE
// ===============================
const renderErrorPage = (
  res,
  status,
  title,
  message
) => {

  return res.status(status).render(
    'pages/404',
    {
      title,
      message
    }
  );
};


// ===============================
// HELPER: VALIDATE ORGANIZATION ID
// ===============================
const parseOrganizationId = (id) => {

  const organizationId = Number(id);

  if (
    !Number.isInteger(organizationId) ||
    organizationId <= 0
  ) {
    return null;
  }

  return organizationId;
};


// ===============================
// VALIDATION RULES
// ===============================
export const organizationValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage(
      'Organization name is required'
    )
    .isLength({
      min: 3,
      max: 150
    })
    .withMessage(
      'Organization name must be between 3 and 150 characters'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage(
      'Organization description is required'
    )
    .isLength({
      max: 500
    })
    .withMessage(
      'Organization description cannot exceed 500 characters'
    ),

  body('contactEmail')
    .notEmpty()
    .withMessage(
      'Contact email is required'
    )
    .isEmail()
    .withMessage(
      'Please provide a valid email address'
    )
    .normalizeEmail()
];


// ===============================
// ORGANIZATIONS LIST PAGE
// ===============================
export const showOrganizationsPage =
  async (req, res) => {

    try {

      const organizations =
        await getAllOrganizations();

      res.render(
        'pages/organizations',
        {
          title:
            'Partner Organizations',
          organizations
        }
      );

    } catch (error) {

      console.error(
        'Error loading organizations:',
        error.message
      );

      return renderErrorPage(
        res,
        500,
        'Server Error',
        'Internal server error while loading organizations'
      );
    }
  };


// ===============================
// ORGANIZATION DETAILS PAGE
// ===============================
export const showOrganizationDetailsPage =
  async (req, res) => {

    try {

      const organizationId =
        parseOrganizationId(
          req.params.id
        );

      if (!organizationId) {

        return renderErrorPage(
          res,
          400,
          'Invalid Request',
          'Invalid organization ID'
        );
      }

      const organizationDetails =
        await getOrganizationDetails(
          organizationId
        );

      if (!organizationDetails) {

        return renderErrorPage(
          res,
          404,
          'Not Found',
          'Organization not found'
        );
      }

      const projects =
        await getProjectsByOrganizationId(
          organizationId
        );

      res.render(
        'pages/organization',
        {
          title:
            organizationDetails.name,
          organizationDetails,
          projects:
            projects || []
        }
      );

    } catch (error) {

      console.error(
        'Error loading organization details:',
        error.message
      );

      return renderErrorPage(
        res,
        500,
        'Server Error',
        'Error loading organization details'
      );
    }
  };


// ===============================
// NEW ORGANIZATION FORM
// ===============================
export const showNewOrganizationForm =
  async (req, res) => {

    try {

      res.render(
        'pages/new-organization',
        {
          title:
            'Add New Organization',
          errors: [],
          oldData: {}
        }
      );

    } catch (error) {

      console.error(
        'Error loading new organization form:',
        error.message
      );

      return renderErrorPage(
        res,
        500,
        'Server Error',
        'Error loading form'
      );
    }
  };


// ===============================
// PROCESS NEW ORGANIZATION
// ===============================
export const processNewOrganizationForm =
  async (req, res) => {

    const results =
      validationResult(req);

    if (!results.isEmpty()) {

      results.array().forEach(
        (error) => {
          req.flash(
            'error',
            error.msg
          );
        }
      );

      return res.status(400).render(
        'pages/new-organization',
        {
          title:
            'Add New Organization',
          oldData: req.body
        }
      );
    }

    try {

      const {
        name,
        description,
        contactEmail
      } = req.body;

      const logoFilename =
        'placeholder-logo.png';

      const organizationId =
        await createOrganization(
          name,
          description,
          contactEmail,
          logoFilename
        );

      req.flash(
        'success',
        'Organization added successfully!'
      );

      res.redirect(
        `/organizations/details/${organizationId}`
      );

    } catch (error) {

      console.error(
        'Error creating organization:',
        error.message
      );

      req.flash(
        'error',
        'Server error. Please try again.'
      );

      res.redirect(
        '/organizations/new'
      );
    }
  };


// ===============================
// API: FETCH ORGANIZATIONS
// ===============================
export const fetchOrganizations =
  async (req, res) => {

    try {

      const organizations =
        await getAllOrganizations();

      res.status(200).json({
        success: true,
        data: organizations
      });

    } catch (error) {

      console.error(
        'Error fetching organizations:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Error retrieving organizations'
      });
    }
  };


// ===============================
// EDIT ORGANIZATION FORM
// ===============================
export const showEditOrganizationForm =
  async (req, res) => {

    try {

      const organizationId =
        parseOrganizationId(
          req.params.id
        );

      if (!organizationId) {

        return renderErrorPage(
          res,
          400,
          'Invalid Request',
          'Invalid organization ID'
        );
      }

      const organizationDetails =
        await getOrganizationDetails(
          organizationId
        );

      if (!organizationDetails) {

        return renderErrorPage(
          res,
          404,
          'Not Found',
          'Organization not found'
        );
      }

      res.render(
        'pages/edit-organization',
        {
          title:
            'Edit Organization',
          organizationDetails
        }
      );

    } catch (error) {

      console.error(
        'Error loading edit organization form:',
        error.message
      );

      return renderErrorPage(
        res,
        500,
        'Server Error',
        'Error loading organization edit form'
      );
    }
  };


// ===============================
// PROCESS EDIT ORGANIZATION
// ===============================
export const processEditOrganizationForm =
  async (req, res) => {

    const organizationId =
      parseOrganizationId(
        req.params.id
      );

    if (!organizationId) {

      return renderErrorPage(
        res,
        400,
        'Invalid Request',
        'Invalid organization ID'
      );
    }

    // VALIDATION
    const results =
      validationResult(req);

    if (!results.isEmpty()) {

      results.array().forEach(
        (error) => {
          req.flash(
            'error',
            error.msg
          );
        }
      );

      return res.redirect(
        `/organizations/edit/${organizationId}`
      );
    }

    try {

      const {
        name,
        description,
        contactEmail
      } = req.body;

      const logoFilename =
        req.body.logoFilename ||
        'placeholder-logo.png';

      await updateOrganization(
        organizationId,
        name,
        description,
        contactEmail,
        logoFilename
      );

      req.flash(
        'success',
        'Organization updated successfully!'
      );

      res.redirect(
        `/organizations/details/${organizationId}`
      );

    } catch (error) {

      console.error(
        'Error updating organization:',
        error.message
      );

      req.flash(
        'error',
        'Error updating organization'
      );

      res.redirect(
        `/organizations/edit/${organizationId}`
      );
    }
  };