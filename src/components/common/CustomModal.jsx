import React from 'react';
import { Dialog } from 'primereact/dialog';

const CustomModal = ({
  visible,
  onHide,
  header,
  children,
  footerActions,
  className = 'w-10 sm:w-8 md:w-5 lg:w-4 xl:w-4',
  style,
  closeOnEscape = true,
  dismissableMask = false,
  position = 'center',
  centered = true,
  widthPercentage = 90
}) => {
  const renderDialog = () => {
    const modalDialog = (
      <Dialog
        className={className}
        header={header}
        visible={visible}
        onHide={onHide}
        footer={footerActions}
        style={{
          ...style,
          maxWidth: centered ? `${widthPercentage}%` : undefined,
          margin: centered ? '0 auto' : undefined
        }}
        modal
        closeOnEscape={closeOnEscape}
        dismissableMask={dismissableMask}
        position={position}
        draggable={false}
        resizable={false}
      >
        {children}
      </Dialog>
    );

    return modalDialog;
  };

  return renderDialog();
};

export default CustomModal;