import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { InputValidator } from '@/lib/input_validator';
import { classNames } from '@/lib/helper'

const CreateForm = ({ formJSON, isPreLoginForm = false, stack = 'vertical', dataSetter, ...otherProps }) => {
  //console.log('Other Props', otherProps)
  //console.log('Workflow is - ', otherProps.workflow)
  const [formData, setFormData] = useState({});
  const [fileUploaded, setFileUploaded] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
     
  const [errors, setErrors] = useState({});
  const [success, showSuccess] = useState(false);
  const [selectData, setSelectData] = useState({});
  const [httpLoading, setHttpLoading] = useState(false);
  

  const handleInputChange = (field, value) => {
    try{
      setFormData((prevData) => ({ ...prevData, [field]: value }));  
    }catch(e){
      console.error("createForm - handleInputChange " + e)
    }
  }
  const handleSubmit = async () => {
    setErrors({})
    let isValid = true;
    for(var i = 0; i < formJSON.body.length; i++){
      let item = formJSON.body[i]
      if(item.required){
        if(item.validator === undefined) item.validator = []
          item.validator.push('isNotEmpty')
        if(item.error === undefined) item.error = []
          item.error.push('This field is required')
      }
      
      if(!validateField(item.field, item.validator, item.validator_fields, item.error) ){
        isValid = false;
        break;
      }
    }
    //console.log("Errors array is  " + JSON.stringify(errors))
    if(!isValid){
      return  
    }
    console.log(formData)
    //setFormData({})
  }

  const validateField = (fieldName, validators, validator_fields, errors) => {
    try{
      //console.log("In createForm - validateField" + JSON.stringify([fieldName, validators, validator_fields, errors]))
      let isValid = true
      //fieldValue = fieldValue ?? '';
      validators = validators ?? [];
      validator_fields = validator_fields ?? [];
      errors = errors ?? [];
      for(var i = 0; i < validators.length; i++){
        let params = []
        params.push(formData?.[fieldName] || '')
        if(validator_fields[i] !== undefined){
          for(var j = 0; j < validator_fields[i].length; j++){
            params.push(formData[validator_fields[i][j]])
          }
        }
        let r = InputValidator[validators[i]](...params) 
        if(!r){ //Returns false when validation fails. eg isEmail - Will return false if its not email
          isValid = false;
          setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: errors[i] 
          }))
          break;
        }     
      }            
      return isValid;              
    }catch(e){
      console.error("In createForm - Error validateField - " + e )
    }
  }
 
  function  renderElement(props, index){
    //console.log("In renderElement - " + props.type)
          
      switch(props.type){
          case 'FTTitle':
              return FTTitle(props, index)
          case 'FTTextInput':
              return FTTextInput(props, index)
          case 'FTTextInput1':
            return FTTextInput1(props, index)    
          case 'FTTextAreaComponent':
            return FTTextAreaComponent(props, index)    
          case 'FTFileComponent':
            return FTFileComponent(props, index)
          case 'FTImageComponent':
            return FTImageComponent(props, index)  
          case 'FTButton':
              return FTButton(props, index)
          case 'FTSelect':
              return FTSelect(props, index)
          case 'FTStateDistrictSelect':
            return FTStateDistrictSelect(props, index)    
          case 'FTRadio':
              return FTRadio(props, index) 
          case 'FTCheckBox':
            return FTCheckBox(props, index)     
          case 'FTLink':
            return FTLink(props, index)      
          case 'FTDynamicSelect':
            return FTDynamicSelect(props, index)   
          case 'FTMultiTextInput':
            return FTMultiTextInput(props, index)   
          case 'FTDate':
            return FTDate(props, index)     
          case 'FTComboBox':
            return FTComboBox(props, index)  
          default:
              return <></>
      }
  }

  function FTCheckBox(props, index){
    function handleChange(e) {
      // Extract the current list of checked items, defaulting to an empty array if undefined
      let checkedItems = formData[props.field] ?? [];
      if (e.target.checked) {
        // If the item is checked and not already in the list, add it
        if (!checkedItems.includes(e.target.value)) {
          checkedItems.push(e.target.value);
        }
      } else {
        // If the item is unchecked, remove it from the list
        checkedItems = checkedItems.filter(item => item !== e.target.value);
      }   
      // Update the form data with the new list of checked items
      setFormData(prevData => ({ ...prevData, [props.field]: checkedItems }));
    }
    return (
      <fieldset key={index} className='my-4'>
        <label htmlFor={props.field} className="block text-sm font-medium leading-6 text-gray-900">
          {props.label}{(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
        </label>
        <div className="space-y-5 my-4">
          {props.options.map((o, i) => (
            <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id={props.field}
                    name={props.field}
                    value={o.k}
                    type="checkbox"
                    aria-describedby="comments-description"
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="comments" className="font-medium text-gray-500">
                    {o.l}
                  </label>
                </div>
            </div>
          ))}
          
        </div>
        {( errors[props.field] !== "" )?<p className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}
      </fieldset>
    )
  }
  function FTRadio(props, index){
    function handleChange(e){
      //console.log("In FTRadio - handleChange - " + e.target.value)
      let params = {}
      params[props.field] = e.target.value
      params[props.field + '_label' ] = props.options.filter((o) => o.k === e.target.value)[0].l
      setFormData((prevData) => ({ ...prevData, ...params }));
    }
    return (
      <fieldset key={index} className='my-4'>
        <label htmlFor={props.field} className="block text-sm font-medium leading-6 text-gray-900">
          {props.label}{(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
        </label>
        <div className="mt-4 space-y-3">
          {props.options.map((o, i) => (
            <div key={o.k} className="flex items-center">
              <input
                defaultChecked={o.k === 'kgs'}
                id={props.field}
                name={props.field}
                value={o.k}
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                onChange={handleChange} 
              />
              <label htmlFor={o.k} className="ml-3 block text-sm font-medium leading-6 text-gray-500">
                {o.l}
              </label>
            </div>
          ))}
        </div>
        {( errors[props.field] !== "" )?<p className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}
      </fieldset>
      
    )
  }
  
  function FTLink(props, index){
    return <p className={classNames("mt-10 text-center text-sm/6 text-gray-500", (props.display && !success)?props.display:"block")} key={index}> 
              {props.mesg1}{' '}
              <a href={props.url} className="font-semibold text-indigo-600 hover:text-indigo-500">
                {props.mesg2}
              </a>
            </p>
  }
  function FTButton(props, index){
    return <div className="mt-10 flex items-center justify-end gap-x-6" key={index}>
              <button type="submit" onClick={() => { otherProps.setIsAsideVisible && otherProps.setIsAsideVisible(false)} } className="text-sm/6 font-semibold text-gray-900">
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {otherProps.submit_text??props.title}
              </button>
          </div>
  }
  function FTImageComponent(props, index){
    const changeHandler = async (event) => {
      console.log(event.target.files[0]);
      const res = await uploadFileS3({'fobj': event.target.files[0], 'setHttpLoading':setHttpLoading, 'ftype': 'image/jpeg'})
      //console.log(res)
      if(res.status === 'success'){
        setImageUploaded(true)
        setFormData((prevData) => ({
          ...prevData,
          [props.field]: res.data
        }));
      }
      //console.log("In FTImageComponent - changeHandler - Response is " + JSON.stringify(res))
    }
    return (!imageUploaded)?(
              <div className="col-span-ful px-6 py-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25" key={index}>
                <div className="mt-2 sm:flex sm:items-center sm:justify-center">
                    <div className="max-w-xl text-sm text-gray-500 text-center">
                        <p id="renew-subscription-description">
                            <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                            <span className="flex flex-col items-center">
                                <label htmlFor={props.field} className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                    <span>{props?.placeholder}</span>
                                    <input id={props.field} name={props.field} type="file" accept="image/*" className="sr-only" onChange={changeHandler} />
                                </label>      
                                <span className="text-xs leading-5 text-gray-500 mx-2">Image up to 3MB</span>
                            </span>
                        </p>
                    </div>
                  </div>
                </div>
              ):(
                <div>
                  <img alt="" src={formData[props.field]?.url} className="block aspect-[10/7] w-full rounded-lg object-cover" />
                </div>
              )
  }
  function FTFileComponent(props, index){
    const changeHandler = async (event) => {
      //console.log(event.target.files[0]);
      const res = await uploadFileS3({'fobj': event.target.files[0], 'setHttpLoading':setHttpLoading, 'ftype': 'application/pdf'})
      if(res.status === 'success'){
        setFileUploaded(true)
        setFormData((prevData) => ({
          ...prevData,
          [props.field]: prevData && prevData[props.field] && Array.isArray(prevData[props.field])
              ? [...prevData[props.field], res.data]  
            : [res.data]
        }));
      }
      //console.log("In FTFileComponent - changeHandler - Response is " + JSON.stringify(res))
    }
    return <div className="col-span-ful px-6 py-10 justify-center rounded-lg border border-dashed border-gray-900/25" key={index}>
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                  {props.label}
                </label>
                <div class="mt-2 sm:flex sm:items-start sm:justify-between">
                    <div class="max-w-xl text-sm text-gray-500">
                      <p id="renew-subscription-description">
                        <DocumentIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                        <label htmlFor={props.field} className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>{props.placeholder}</span>
                            <input id={props.field} name={props.field} accept="application/pdf" type="file" className="sr-only" onChange={changeHandler} />
                        </label>      
                        <span className="text-xs leading-5 text-gray-500 mx-2">PDF up to 3MB</span>
                      </p>
                    </div>
                </div>
                { <FTFileAttachment {...props} fileUploaded={fileUploaded}></FTFileAttachment> }
            </div>
  }
  function FTFileAttachment(props){
    if(!formData || formData && (formData[props.field] === undefined || formData[props.field].length === 0)){
      return <></>
    }
  
    const deleteFile = (hash) =>{
      formData[props.field].map((item) => {
        if(item.hash === hash)
          deleteFileS3(item.name, setHttpLoading)  
      })
      let newFiles = formData[props.field].filter((item) => !item.hash || item.hash !== hash)
      setFormData((prevData) => ({
        ...prevData,
        [props.field]: newFiles
      }));
    }
    return (
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                {formData && formData[props.field].map((item, index) => (
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={index}>
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">{item.fname}</span>
                      <span class="flex-shrink-0 text-gray-400">
                          {item.size && !isNaN(item.size) ? `${Math.floor(Number(item.size) / 1000)} KB` : "NA"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" onClick={(e) => {e.preventDefault(); item.hash && deleteFile(item.hash)}} className="font-medium text-indigo-600 hover:text-indigo-500">
                      Delete
                    </a>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href={item.url} className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
                ))}
              </ul>
            </dd>
          </div>
    )
  }
  function FTTextAreaComponent(props, index){
    const className = ( errors[props.field] && errors[props.field] !== "" )? "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" : "block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    return <div className="col-span-full" key={index}>
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                {props.label}
              </label>
              <div className="mt-2">
                <textarea
                  id={props.field}
                  name={props.field}
                  rows={3}
                  onChange={(e) => { handleInputChange(props.field, e.target.value)} }
                  value={(formData && props.field && formData[props.field])?formData[props.field]:''}
                  className={className}
                  placeholder={props.placeholder}
                />
              </div>
              {( errors[props.field] !== "" )?<p id="email-error" className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}  
          </div>
  }
  function FTTitle(props, index){
      if(!otherProps.isContainer && props.display === undefined ) { return <div key={index}>
                <h2 className="text-base font-semibold leading-7 text-gray-900">{props.title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {props.subtitle}
                </p>
            </div> }
  }
   //values:[{l:'UX Research', k:'ux'},{l:'Web Development', k:'wb'} ]
  const FTDynamicSelect = (props, index) => { //Dynamic Means data loaded from backend using builder in config file
    props.options = selectData[props.field]; // The select data is loaded from backend in useEffect init code. 
    //console.log("Dynamic Select Values for field - " + props.field + JSON.stringify(props.options))
    return FTSelect(props, index)
  }
  function FTComboBox(props, index){
    function handleSelectChange(field, item) {
      setFormData((prevData) => ({
          ...prevData,
          [field]: item
      }));
    }
    //Need to provide the selected data as reference of the options
    const selectedData = (formData && props.field && formData[props.field])?formData[props.field]:[]
    const filteredData = props.options.filter(item => 
      selectedData.find(selected => selected.l === item.l && selected.k === item.k)
    );
    //const filteredData = props.options.filter(item => selectedData.includes(item));
    return ( <div>
              <ComboxBox data={props.options} label={props.label} field={props.field} selectedData={filteredData} setSelectedData={handleSelectChange}/>
              {false && JSON.stringify(filteredData)}
            </div>  )
  }
  function FTStateDistrictSelect(props, index){
      const stateOptions = states.map((state) => ({ k: state, l: state }))
      const districtOptions = districts
                                      .filter((district) => district.state === formData.state)
                                      .flatMap((district) => 
                                        district.dists.map((dist) => ({
                                          o: dist,
                                          l: dist
                                        }))
                                      );
      return <div>
                <FTSelect field="state" options={stateOptions} index={`State-${index}`} label="State" />
                <FTComboBox field="district" options={districtOptions} index={`District-${index}`} label="District" />
            </div>
  }
  function FTSelect(props, index){
    const className = ( errors[props.field] && errors[props.field] !== "" )?"mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-500 ring-1 ring-inset ring-red-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6":"mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-500 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" 
    function handleSelectChange(field, selectedValue){
      let params = {}
      params[field] = selectedValue
      const matchingOption = props.options.find(o => o.k === selectedValue);
      //console.log("In FTSelect - handleSelectChange - " + JSON.stringify(matchingOption))
      //params[props.label] = matchingOption && matchingOption.k ? matchingOption.l : '';
      //console.log("In FTSelect - handleSelectChange - " + JSON.stringify(params))
      setFormData((prevData) => ({ ...prevData, ...params }));      
    }
    return (
      <div key={index} className='py-2'>
        <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
          {props.label}{(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
        </label>
        <select
          id={props.field}
          name={props.field}
          onChange={(e) => handleSelectChange(props.field, e.target.value) }
          value={(formData && props.field && formData[props.field])?formData[props.field]:''}
          className={className}
        > <option value=""></option>
          {
          props?.options?.map((o, index) => (
            <option value={o.k} key={index}>{o.l}</option>
          ))
        }
        </select>
        {( errors[props.field] !== "" )?<p className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}
      </div>
    )
  }
  function FTTextInput1(props, index){
    const className = ( errors[props.field] && errors[props.field] !== "" )? "block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6" : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    return (
      <div key={index} className="pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{props.label}
          {(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
          </dt>
          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
            <div className='flex flex-col'>
                  <input
                        defaultValue=""
                        id={props.field}
                        name={props.field}
                        type={props.inputType || 'text'} 
                        value={(formData[props.field] !== undefined)?(formData[props.field] + ''):''}
                        placeholder={props.placeholder}
                        onChange={(e) => { handleInputChange(props.field, e.target.value)} }
                        className={className}
                  />
                  {( errors[props.field] !== "" )?<p className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}
              </div>
              
          </dd>
      </div>
    )
  }
  
  function FTDate(props, index){
    return (
      <div key={index} className="pt-4">
        <div className="flex items-center justify-between">
          <label htmlFor={props.field} className="block text-sm font-medium leading-6 text-gray-900">
            {props.label}{(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
          </label>
        </div>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            defaultValue=""
            id={props.field}
            name={props.field}
            type="date"
            value={(formData && formData[props.field] !== undefined)?(formData[props.field] + ''):''}
            placeholder={props.placeholder}
            onChange={(e) => { handleInputChange(props.field, e.target.value)} }
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <p className="mt-2 text-sm text-gray-500">
              {(props.helperText)?props.helperText:''}
          </p>
        </div>
        {( errors[props.field] !== "" )?<p id="email-error" className="mt-2 text-sm text-red-600">{errors[props.field]}</p>:''}
      </div>
    )
  }
  function FTMultiTextInput(props, index) {
    let financials = [];
    if (!formData || formData[props.field] === undefined) {
        const headers = props.header_fields();
        const initialFinancials = props?.params?.length > 0 && props.params.map((param) => {
            const row = { 
                name: param,
                values: headers.map((quarter, index) => ({
                    period: quarter,
                    value: '',
                    order: index + 1
                }))
            };
            return row;
        });
        financials = initialFinancials;
    } else {
        financials = formData[props.field];
    }

    const handleInputChange = (field, rowIndex, period, value) => {
        const updatedFinancials = (formData && formData[field] !== undefined) ? [...formData[field]] : financials;
        const valueIndex = updatedFinancials[rowIndex].values.findIndex(v => v.period === period);
        if (valueIndex !== -1) {
            updatedFinancials[rowIndex].values[valueIndex].value = value;
        }
        setFormData((prevData) => ({ ...prevData, [field]: updatedFinancials }));
    };

    return (
        <div className="inline-block min-w-full py-3 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr className="divide-x divide-gray-200">
                        <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"></th>
                        {financials[0] && financials[0].values.map((quarter, index) => (
                            <th key={index} scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {quarter.period}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {financials.map((row, rowIndex) => (
                        <tr key={row.name} className="divide-x divide-gray-200">
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                {row.name}
                            </td>
                            {row.values.map((value, index) => (
                                <td key={index} className="whitespace-nowrap p-4 text-sm text-gray-500">
                                    <div className="relative mt-2">
                                        <input
                                            name={value.period}
                                            type="text"
                                            value={value.value}
                                            placeholder=""
                                            onChange={(e) => handleInputChange(props.field, rowIndex, value.period, e.target.value)}
                                            className="peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600"
                                        />
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  }
  function FTTextInput(props, index){
    //console.log('In FTTextInput - ', props)
   
    const className = ( errors[props.field] && errors[props.field] !== "" )? "block w-full rounded-md border-0 py-1.5 pr-8 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-5" : "block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
    return (
            <div key={index} className="pt-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={props.field} className="block text-sm font-medium leading-5 text-gray-900">
                    {props.label}{(props.required)?<span className='text-red-500 ml-1'>*</span>:''}
                  </label>
                  {( props.link && props.link.url )?<div className="text-sm">
                      <a href={props.link.url} className="font-semibold text-indigo-600 hover:text-indigo-500">
                      {props.link.text}
                      </a>
                    </div>:''}
                </div>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id={props.field}
                    name={props.field}
                    type={props.inputType || 'text'} 
                    value={( formData && formData[props.field] !== undefined)?(formData[props.field] + ''):''}
                    placeholder={props.placeholder}
                    onChange={(e) => { handleInputChange(props.field, e.target.value)} }
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    className={className}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                      {(props.helperText)?props.helperText:''}
                  </p>
                </div>
                {( errors[props.field] !== "" )?<p id="email-error" className="mt-1 text-sm text-red-600">{errors[props.field]}</p>:''}
            </div>
      )
  }

  function loggedInForm(){
    return (
      <>
        {success && <SuccessAlert message="Successfully updated" hideSuccess={() => showSuccess(false)} ></SuccessAlert>}
        <div className="border-b border-gray-900/10 pb-12">
          <div className={(stack === 'horizontal')?'flex space-x-4':'grid grid-cols-2 gap-2'}>
          { (httpLoading)?<LoadingOverlay/> : formJSON?.body.length > 0 && formJSON.body.map((props, index) => ( 
            <div key={index} className={(props.type == 'FTMultiTextInput' || props.type == 'FTTitle' || otherProps?.w_full)?"col-span-2":"col-span-1 w-4/5 mx-auto justify-center"}>
              { renderElement(props, index) }
            </div>
            ))
          }
          </div>  
        </div>
      </>
    )
  }
  return loggedInForm()

}

export {CreateForm}