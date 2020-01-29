import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CustomFieldsSettingsPane } from '@folio/stripes/smart-components';

class CustomFieldsSettings extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  redirectToEdit = () => {
    this.props.history.push('/users/custom-fields/edit');
  }

  render() {
    return (
      <CustomFieldsSettingsPane
        backendModuleName="users"
        appIconName="users"
        entityTypeTranslationId="ui-users.meta.title"
        redirectToEdit={this.redirectToEdit}
      />
    );
  }
}

export default CustomFieldsSettings;
