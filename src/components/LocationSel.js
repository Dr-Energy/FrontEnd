import {useState, useEffect,Fragment } from 'react';
import address from '../data/address.json'
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useRecoilState } from 'recoil';
import { userLocationState } from '../recoil/atoms'; // 경로를 올바르게 지정

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function LocationSel({ onChange = () => {} }) {
    const [userLocation, setUserLocation] = useRecoilState(userLocationState);
    const [largeCategories, setLargeCategories] = useState([]);
    const [selectedLarge, setSelectedLarge] = useState('');
    const [mediumCategories, setMediumCategories] = useState([]);
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedSmall, setSelectedSmall] = useState('');
    const [smallCategories, setSmallCategories] = useState([]);

    useEffect(() => {
      let tm = address.map(item => item.sido);
      tm = new Set(tm);
      tm = [...tm];
      setLargeCategories(tm);
    }, []);

    const handleLargeChange = (value) => {
      setSelectedLarge(value);
      const filteredMediums = address.filter(item => item.sido === value).map(item => item.gugun);
      setMediumCategories([...new Set(filteredMediums)]);
      setSelectedMedium('');
      setSmallCategories([]);
      setSelectedSmall('');
    };

    const handleMediumChange = (value) => {
      setSelectedMedium(value);
      const filteredSmalls = address.filter(item => item.sido === selectedLarge && item.gugun === value).map(item => item.eupmyeondong);
      setSmallCategories([...new Set(filteredSmalls)]);
      setSelectedSmall('');
    };

    const handleSmallChange = (value) => {
      setSelectedSmall(value);
      const newLocation = { sido: selectedLarge, gugun: selectedMedium, eupmyeondong: value };
      // setUserLocation(newLocation); -> 삭제해야 함
      //-> userLocation은 RegionId가 들어가야하는데 셀렉트주소가 들어가서 계속 오브젝트로 넘어와 에러 발생
      onChange(newLocation);
    };

    return (
      <>
        <div className="flex w-full items-center min-w-[300px]">
          <div className="text-lg w-1/3">
            <Listbox value={selectedLarge} onChange={handleLargeChange}>
              {({ open }) => (
                <>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white bg-opacity-20 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6">
                      <span className="block truncate">{selectedLarge || '시 / 도'}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {largeCategories.map((sido, index) => (
                          <Listbox.Option
                            key={index}
                            className={({ active }) =>
                              classNames(
                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                'relative cursor-default select-none py-2 pl-3 pr-9'
                              )
                            }
                            value={sido}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                  {sido}
                                </span>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-indigo-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>

          {mediumCategories.length > 0 && (
            <div className="text-lg px-2 w-1/3">
              <Listbox value={selectedMedium} onChange={handleMediumChange}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white bg-opacity-20 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate">{selectedMedium || '구 / 군'}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {mediumCategories.map((gugun, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) =>
                                classNames(
                                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={gugun}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {gugun}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          )}

          {smallCategories.length > 0 && (
            <div className="text-lg w-1/3">
              <Listbox value={selectedSmall} onChange={handleSmallChange}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white bg-opacity-20 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate">{selectedSmall || '읍 / 면 / 동'}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {smallCategories.map((eupmyeondong, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) =>
                                classNames(
                                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={eupmyeondong}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                    {eupmyeondong}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
          )}
        </div>
      </>
    );
}
