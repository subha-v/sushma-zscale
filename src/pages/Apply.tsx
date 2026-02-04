import { useState } from 'react';
import { submitToMasterDatabase, FORM_TYPES } from '../config/api';

export function Apply() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    role: '',
    school: '',
    skills: '',
    hasIdea: '',
    description: '',
    timeline: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to Google Apps Script backend
      const success = await submitToMasterDatabase({
        formType: FORM_TYPES.BUILD_APPLICATION,
        name: formData.name,
        email: formData.email,
        linkedin: formData.linkedin,
        role: formData.role,
        school: formData.school,
        skills: formData.skills,
        hasIdea: formData.hasIdea,
        description: formData.description,
        timeline: formData.timeline,
      });

      if (success) {
        setSubmitted(true);
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4 text-cyan-400">Application Received!</h1>
          <p className="text-gray-400 mb-8">
            Thanks for applying to build with zScale. We will review your application and get back to you within 48 hours.
          </p>
          <a href="/" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-accent">Build with zScale</h1>
          <p className="text-gray-400">You build the product. We handle everything else.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn Profile</label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="https://linkedin.com/in/johndoe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a... *</label>
            <select name="role" required value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white">
              <option value="">Select one</option>
              <option value="cs_student">CS/Engineering Student</option>
              <option value="mba_student">MBA Student</option>
              <option value="recent_grad">Recent Graduate</option>
              <option value="working_professional">Working Professional</option>
              <option value="founder">Current Founder</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">University/Company</label>
            <input type="text" name="school" value={formData.school} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="UT Dallas, SMU, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technical Skills *</label>
            <input type="text" name="skills" required value={formData.skills} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white" placeholder="Python, React, AWS, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Do you have a startup idea?</label>
            <select name="hasIdea" value={formData.hasIdea} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white">
              <option value="">Select one</option>
              <option value="yes_building">Yes, and I am building it</option>
              <option value="yes_not_started">Yes, but have not started</option>
              <option value="exploring">Exploring ideas</option>
              <option value="open">Open to ideas from zScale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tell us about yourself</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white resize-none" placeholder="What are you working on?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">When do you want to start?</label>
            <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 text-white">
              <option value="">Select one</option>
              <option value="immediately">Immediately</option>
              <option value="1_month">Within 1 month</option>
              <option value="3_months">Within 3 months</option>
              <option value="after_graduation">After graduation</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-ink font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-8">We review applications within 48 hours.</p>
      </div>
    </div>
  );
}