import React, { useState, useEffect } from 'react';
import { Upload, Shield, CheckCircle, XCircle, Camera, FileText, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const KycVerification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    documentType: 'nin',
    documentNumber: '',
    frontImage: null,
    backImage: null,
    selfieImage: null
  });
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'unverified');

  const documentTypes = [
    { value: 'nin', label: 'National ID (NIN)', description: 'National Identification Number' },
    { value: 'driver_license', label: "Driver's License", description: "Valid driver's license" },
    { value: 'passport', label: 'International Passport', description: 'Valid passport' },
    { value: 'voter_card', label: "Voter's Card", description: "PVC Voter's card" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload JPEG or PNG images only');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    
    toast.success(`${field.replace('Image', '')} uploaded successfully`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.documentNumber) {
      toast.error('Please enter your document number');
      return;
    }
    
    if (!formData.frontImage) {
      toast.error('Please upload front side of document');
      return;
    }
    
    if (!formData.selfieImage) {
      toast.error('Please upload a selfie');
      return;
    }

    try {
      setUploading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setKycStatus('pending');
      toast.success('KYC submitted successfully! Verification takes 24-48 hours.');
      
      // Reset form
      setFormData({
        documentType: 'nin',
        documentNumber: '',
        frontImage: null,
        backImage: null,
        selfieImage: null
      });
      setStep(1);
      
    } catch (error) {
      toast.error('Failed to submit KYC. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusInfo = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          color: 'green',
          icon: CheckCircle,
          title: 'KYC Verified',
          message: 'Your identity has been successfully verified.',
          date: user?.kycVerifiedAt || new Date().toISOString()
        };
      case 'pending':
        return {
          color: 'yellow',
          icon: AlertCircle,
          title: 'Verification Pending',
          message: 'Your documents are under review. This usually takes 24-48 hours.',
          date: user?.kycSubmittedAt || new Date().toISOString()
        };
      case 'rejected':
        return {
          color: 'red',
          icon: XCircle,
          title: 'Verification Failed',
          message: user?.kycRejectionReason || 'Document verification failed. Please resubmit with clearer images.',
          date: user?.kycSubmittedAt || new Date().toISOString()
        };
      default:
        return {
          color: 'gray',
          icon: Shield,
          title: 'KYC Required',
          message: 'Complete KYC verification to unlock all features including withdrawals.',
          date: null
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // If KYC is already verified or pending, show status
  if (kycStatus === 'verified' || kycStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-${statusInfo.color}-100 rounded-full mb-6`}>
              <StatusIcon size={40} className={`text-${statusInfo.color}-600`} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {statusInfo.title}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {statusInfo.message}
            </p>
            
            {statusInfo.date && (
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700">
                  Submitted: {formatDate(statusInfo.date)}
                </span>
              </div>
            )}
            
            {kycStatus === 'verified' && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Verification Benefits</p>
                    <ul className="mt-2 text-sm text-green-800 space-y-1">
                      <li>• Unlimited withdrawals</li>
                      <li>• Higher transaction limits</li>
                      <li>• Priority customer support</li>
                      <li>• Access to premium features</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {kycStatus === 'pending' && (
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">What happens next?</p>
                      <ul className="mt-2 text-sm text-yellow-800 space-y-1">
                        <li>• Our team will review your documents within 24-48 hours</li>
                        <li>• You'll receive email notifications about the status</li>
                        <li>• Continue using the platform with deposit limits</li>
                        <li>• Contact support if you need to update your documents</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = '/support'}
                  className="w-full btn-secondary"
                >
                  Contact Support
                </button>
              </div>
            )}
            
            {kycStatus === 'rejected' && (
              <div className="mt-8">
                <button
                  onClick={() => setKycStatus('unverified')}
                  className="btn-primary"
                >
                  Resubmit KYC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
        <p className="text-gray-600">Verify your identity to unlock full platform access</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${stepNumber < step ? 'bg-green-100 text-green-600' :
                    stepNumber === step ? 'bg-primary-600 text-white' :
                    'bg-gray-100 text-gray-400'}
                `}>
                  {stepNumber < step ? '✓' : stepNumber}
                </div>
                <span className="mt-2 text-xs font-medium text-gray-600">
                  {stepNumber === 1 && 'Document Type'}
                  {stepNumber === 2 && 'Document Details'}
                  {stepNumber === 3 && 'Upload Images'}
                  {stepNumber === 4 && 'Submit'}
                </span>
              </div>
              
              {stepNumber < 4 && (
                <div className={`flex-1 h-1 ${stepNumber < step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Document Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Select Document Type</h2>
                <p className="text-gray-600 mb-6">Choose the government-issued ID you want to use for verification</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentTypes.map((doc) => (
                    <button
                      key={doc.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, documentType: doc.value }));
                        setStep(2);
                      }}
                      className={`
                        p-4 border rounded-lg text-left hover:border-primary-300 hover:bg-primary-50 transition-colors
                        ${formData.documentType === doc.value ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FileText size={20} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.label}</p>
                          <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary"
                    disabled={!formData.documentType}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Document Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Document Details</h2>
                <p className="text-gray-600 mb-6">Enter your document information exactly as it appears</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="label">Document Number</label>
                    <input
                      type="text"
                      name="documentNumber"
                      value={formData.documentNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your document number"
                      required
                    />
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Important Information</p>
                        <ul className="mt-2 text-sm text-blue-800 space-y-1">
                          <li>• Enter the document number exactly as it appears</li>
                          <li>• Use capital letters if shown on the document</li>
                          <li>• Include all digits and characters</li>
                          <li>• Do not include spaces unless they appear on the document</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    disabled={!formData.documentNumber}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Images */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Images</h2>
                <p className="text-gray-600 mb-6">Upload clear images of your document and a selfie</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Front Side */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Front Side of Document</h3>
                    <div className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      hover:border-primary-400 hover:bg-primary-50 transition-colors
                      ${formData.frontImage ? 'border-green-300 bg-green-50' : 'border-gray-300'}
                    `}
                    onClick={() => document.getElementById('frontImage').click()}
                    >
                      <input
                        id="frontImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('frontImage', e.target.files[0])}
                        capture="environment"
                      />
                      
                      {formData.frontImage ? (
                        <div className="space-y-3">
                          <CheckCircle size={40} className="text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-700">Front side uploaded</p>
                          <p className="text-xs text-green-600">
                            {formData.frontImage.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload size={40} className="text-gray-400 mx-auto" />
                          <p className="text-sm font-medium text-gray-700">Click to upload</p>
                          <p className="text-xs text-gray-500">
                            JPEG, PNG (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selfie */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Selfie with Document</h3>
                    <div className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      hover:border-primary-400 hover:bg-primary-50 transition-colors
                      ${formData.selfieImage ? 'border-green-300 bg-green-50' : 'border-gray-300'}
                    `}
                    onClick={() => document.getElementById('selfieImage').click()}
                    >
                      <input
                        id="selfieImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('selfieImage', e.target.files[0])}
                        capture="user"
                      />
                      
                      {formData.selfieImage ? (
                        <div className="space-y-3">
                          <CheckCircle size={40} className="text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-700">Selfie uploaded</p>
                          <p className="text-xs text-green-600">
                            {formData.selfieImage.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Camera size={40} className="text-gray-400 mx-auto" />
                          <p className="text-sm font-medium text-gray-700">Take a selfie</p>
                          <p className="text-xs text-gray-500">
                            Show your face and document
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back Side (Optional) */}
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-gray-900">Back Side of Document (Optional)</h3>
                  <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    hover:border-gray-400 hover:bg-gray-50 transition-colors
                    ${formData.backImage ? 'border-green-300 bg-green-50' : 'border-gray-300'}
                  `}
                  onClick={() => document.getElementById('backImage').click()}
                  >
                    <input
                      id="backImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('backImage', e.target.files[0])}
                      capture="environment"
                    />
                    
                    {formData.backImage ? (
                      <div className="space-y-2">
                        <CheckCircle size={30} className="text-green-600 mx-auto" />
                        <p className="text-sm font-medium text-green-700">Back side uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload size={30} className="text-gray-400 mx-auto" />
                        <p className="text-sm font-medium text-gray-700">Upload back side (if applicable)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Guidelines */}
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Image Guidelines</p>
                      <ul className="mt-2 text-sm text-yellow-800 space-y-1">
                        <li>• Use good lighting and clear focus</li>
                        <li>• All document details must be readable</li>
                        <li>• Selfie must show your full face clearly</li>
                        <li>• Document must be fully visible in selfie</li>
                        <li>• Avoid glare and shadows</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn-primary"
                    disabled={!formData.frontImage || !formData.selfieImage}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review & Submit</h2>
                <p className="text-gray-600 mb-6">Review your information before submission</p>
                
                <div className="space-y-6">
                  {/* Document Info */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Document Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Document Type</p>
                        <p className="font-medium">
                          {documentTypes.find(d => d.value === formData.documentType)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Document Number</p>
                        <p className="font-medium font-mono">{formData.documentNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload Summary */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Upload Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText size={20} className="text-gray-400" />
                          <span>Front Side</span>
                        </div>
                        <span className="text-green-600 font-medium">Uploaded</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Camera size={20} className="text-gray-400" />
                          <span>Selfie</span>
                        </div>
                        <span className="text-green-600 font-medium">Uploaded</span>
                      </div>
                      
                      {formData.backImage && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText size={20} className="text-gray-400" />
                            <span>Back Side</span>
                          </div>
                          <span className="text-green-600 font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 mb-2">Data Privacy Notice</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Your documents are encrypted and stored securely</li>
                          <li>• We only use this information for identity verification</li>
                          <li>• Your data is never shared with third parties</li>
                          <li>• Documents are deleted after 90 days of verification</li>
                          <li>• You can request data deletion at any time</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                      I confirm that all information provided is accurate and complete.
                      I authorize Babban to verify my identity using the documents provided.
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={20} />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Benefits Card */}
      <div className="mt-6 card">
        <h3 className="font-medium text-gray-900 mb-4">Why Verify Your Identity?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield size={20} className="text-green-600" />
              </div>
              <span className="font-medium text-green-900">Enhanced Security</span>
            </div>
            <p className="text-sm text-green-800">
              Protect your account from unauthorized access and fraud
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <span className="font-medium text-blue-900">Higher Limits</span>
            </div>
            <p className="text-sm text-blue-800">
              Unlock unlimited withdrawals and higher transaction limits
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle size={20} className="text-purple-600" />
              </div>
              <span className="font-medium text-purple-900">Full Access</span>
            </div>
            <p className="text-sm text-purple-800">
              Access all platform features and priority customer support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycVerification;