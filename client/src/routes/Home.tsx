import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';
import Alerts from '../components/Alerts';
import {InviteHousehold , Modal2}  from './InviteHousehold'

import { UserType, ItemType } from '../types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faCaretDown, faCaretUp, faCrown, faEnvelope, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend, 
  BarElement } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend,
  BarElement);


interface User {
  _id: string;
  username: string;
}

interface Debt {
  owedBy: User;
  owedTo: User;
  amount: number;
}

export default function Home() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  // Get the state passed from context
  const { user, updateUser } = useUserContext();
  const userId = user?.id;
  const defaultPFP = "data:image/jpeg;base64,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"

  // Household info variables
  const [ householdName, setHouseholdName ] = useState("");
  const [ householdMembers, setHouseholdMembers ] = useState<UserType[]>([]);
  const [ purchaseHistory, setPurchaseHistory ] = useState<ItemType[]>([]);
  const [ historyDisplayedLength, setHistoryDisplayedLength ] = useState(0);
  const [ debts, setDebts ] = useState<Debt[]>([]);
  const [ totalExpenses, setTotalExpenses ] = useState<string>("0");
  const [ totalPaid, setTotalPaid ] = useState<string>("0");
  const [ householdAge, setHouseholdAge ] = useState(100);
  const [ avgExpenditure, setAvgExpenditure ] = useState(100);

  // Chart data
  const [ expenditurePerMonthData, setExpenditurePerMonthData ] = useState<any>();
  const [ expensesByCategory, setExpensesByCategory ] = useState<any>();
  const [ expensesByItem, setExpensesByItem ] = useState<any>();
  const [ frequenciesByItem, setFrequenciesByItem ] = useState<any>();
  const [ numBarsDisplayed ] = useState(15);

  // Toggle confirmation modal for account deletion
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const openModal = () => setShowConfirmDelete(true);
  const closeModal = () => setShowConfirmDelete(false);

  // Modal for Invite Household
  const [showInviteHousehold, setInviteHousehold] = useState(false);
  // Function to open the modal
  const openModal2 = () => setInviteHousehold(true);
  // Function to close the modal
  const closeModal2 = () => setInviteHousehold(false);

  const getHouseholdInfo = async () => {
    // Get household name
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setHouseholdName(data.name);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Get household members
    try {
      const url = `http://localhost:6969/household/members/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setHouseholdMembers(data);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const handleLeave = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/household/leave/${householdId}`;

      // Create the POST request with userId in the body
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Pass userId in the request body
      });

      if (response.ok) {
        // alert(`User ${userId} left household successfully`)
        updateUser();
        navigate('/profile');
      } else {
        alert(`Failed to leave household`)
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const getPurchaseHistory = async () => {
    // Get purchase history
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/purchaseHistory`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        // Parse purchaseDate into Date objects
        const parsedData = data.map((item: ItemType) => ({
          ...item,
          purchaseDate: new Date(item.purchaseDate),
        }));
        setPurchaseHistory(parsedData);
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    /* Get chart data */

    // Expenditure per month
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expenditurePerMonth`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        // Intialize chart data
        setExpenditurePerMonthData({
          labels: data.labels, 
          datasets: [
            {
              label: "Expenditure",
              data: data.data,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch expenses per month")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Expenses by category
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expensesByCategory`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        // Intialize chart data
        setExpensesByCategory({
          labels: data.labels, 
          datasets: [
            {
              label: "Expenditure",
              data: data.data,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#2a71d0",
                "#325374",
                "#f3ba2f",
                "#f28482",
                "#96c7bbad",
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch expenses by category")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Expenses by item
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expensesByItem`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        // Intialize expenses chart data
        setExpensesByItem({
          labels: data.expenses.labels.slice(0, numBarsDisplayed), 
          datasets: [
            {
              label: "Expenditure",
              data: data.expenses.data.slice(0, numBarsDisplayed),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#2a71d0",
                "#325374",
                "#f3ba2f",
                "#f28482",
                "#96c7bbad",
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });

        // Intialize frequencies chart data
        setFrequenciesByItem({
          labels: data.frequencies.labels.slice(0, numBarsDisplayed), 
          datasets: [
            {
              label: "Expenditure",
              data: data.frequencies.data.slice(0, numBarsDisplayed),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#2a71d0",
                "#325374",
                "#f3ba2f",
                "#f28482",
                "#96c7bbad",
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch expenses by item")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  // Get debts
  const fetchDebts = async () => {
    if (!householdId || !user) return;

    try {
        // Make a PATCH request to update debts
        const response = await fetch(`http://localhost:6969/payment/debts/${householdId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Include an empty body or relevant data if needed
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Debt[] = await response.json();
        setDebts(data);
    } catch (error) {
        console.error('Error fetching and updating debts:', error);
    }
  };

  useEffect(() => {
    getHouseholdInfo();
    getPurchaseHistory();
    fetchDebts();
  }, [householdId]);

  // Update when purchase history fetched
  useEffect(() => {
    // Set history displayed length
    setHistoryDisplayedLength((purchaseHistory.length >= 10) ? 10 : purchaseHistory.length);

    // Calculate total expenses
    let expenses = purchaseHistory.reduce((sum, item) => sum + (item.cost || 0), 0);
    setTotalExpenses((expenses / 100).toFixed(2));

    // Calculate household age
    if (purchaseHistory[0]) {
      const creationDate = purchaseHistory[0].purchaseDate;
      const currentDate = new Date(); // Current date

      // Calculate the difference in time (milliseconds)
      const differenceInMilliseconds = currentDate.getTime() - creationDate.getTime();

      // Convert the difference to days
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      setHouseholdAge(differenceInDays);
    }
  }, [purchaseHistory]);

  // Update avg expenditure when per month data fetched
  useEffect(() => {
    console.log("exp per month: ", expenditurePerMonthData)

    let numDataPoints = expenditurePerMonthData?.labels.length;
    let val = numDataPoints > 0 ? Number(totalExpenses) / numDataPoints : 0;

    setAvgExpenditure(val);
  }, [expenditurePerMonthData]);

  useEffect(() => {
    // Calculate total debt
    let allDebts = 0;
    for (let debt of debts) {
      allDebts += debt.amount / 100;
    }
    setTotalPaid((Number(totalExpenses) - allDebts).toFixed(2));
  }, [debts, totalExpenses])

  if (!(householdName && householdMembers && purchaseHistory && expenditurePerMonthData)) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="">
      <Alerts />
      <div className="p-6 mt-6 mb-0 flex gap-2 justify-between items-start">
        <div className="flex flex-col gap-4 justify-between items-start">
          <h1 className="text-4xl font-bold">{householdName}</h1>
          <div className="flex gap-6 items-center">
            <h1 className="text-lg font-semibold flex gap-2 justify-between items-center">
              <FontAwesomeIcon icon={faUser} className="fa-regular text-lg" />
              {householdMembers.length} Member{householdMembers.length > 1 && "s"}
            </h1>
            <div className="text-lg font-semibold ">
              Created {purchaseHistory[0]?.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
            </div>
          </div>
        </div>
        {/* Leave Household */}
        <div className="flex gap-2">
          <button className="pf-btn" onClick={openModal}>
            LEAVE HOUSEHOLD
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa-regular text-xs" />
          </button>
          <Confirm
            show={showConfirmDelete}
            onClose={closeModal}
            onConfirm={handleLeave}
            message="Are you sure you want to leave this household?">
          </Confirm>

          <button 
            className="pf-btn"
              onClick={openModal2}>
            INVITE ROOMMATE
            <FontAwesomeIcon icon={faPlus} className="fa-regular text-xs" />
          </button>
          <Modal2 show={showInviteHousehold} onClose={closeModal2}>
            <InviteHousehold onClose={closeModal2} householdId={householdId}/> 
          </Modal2>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {householdMembers.map((member, i) => (
          <div className="w-[32%] flex gap-2 p-4 bg-green-400 text-white rounded-xl"
              key={i}>
            <img className="w-12 h-12 rounded-full" src={member.pfp ? member.pfp : defaultPFP} alt="Profile" />
            <div className="flex flex-col items-start">
              <div className="font-semibold flex gap-2 items-center">
                {member.username}
                {member._id !== userId &&
                  <a href={`mailto:${member.email}`}>
                    <FontAwesomeIcon icon={faEnvelope} className="fa-regular text-lg" />
                  </a>
                }
              </div>
              <div>
                {member.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h1 className="mt-12 mb-6 text-3xl text-left font-bold">Household Summary</h1>
      <div className="bg-black text-white p-12 flex gap-2 justify-between rounded-xl">
        <div className="flex gap-2 items-end">
          <div className="text-3xl font-medium">{purchaseHistory.length}</div>
          <div className="text-sm">items purchased</div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="text-3xl font-medium">${avgExpenditure.toFixed(2)}</div>
          <div className="text-sm">average per month</div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="text-3xl font-medium">${totalExpenses}</div>
          <div className="text-sm">spent in total</div>
        </div>
        <div className="flex gap-2 items-end">
          <div className="text-3xl font-medium">${totalPaid}</div>
          <div className="text-sm">paid back</div>
        </div>
      </div>

      {/* Purchase History and Stats */}
      {purchaseHistory.length > 0 &&
        <div className="p-4 flex gap-4 gap-y-12 flex-wrap justify-between items-center">
          {(expenditurePerMonthData && expenditurePerMonthData.labels.length > 1) && 
            <div className="w-fit flex flex-col">
              <div>Expenses Over Time</div>
              <div className="w-[500px] h-[200px]">
                <Line
                  data={expenditurePerMonthData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenditure Over Time"
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw as number; // get raw value
                            return `$${Number(value).toFixed(2)}`; // currency format
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: function (value) {
                            return `$${Number(value).toFixed(2)}`; // currency format
                          }
                        }
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          }
          <div className="w-fit flex flex-col mr-12">
            <div>Expenses By Category</div>
            {expensesByCategory ? 
              <div className="w-[300px] h-[300px]">
                <Doughnut
                  data={expensesByCategory}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenses By Category"
                      },
                      legend: {
                        display: true
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw as number; // get raw value
                            return `$${Number(value).toFixed(2)} (${(value / Number(totalExpenses) * 100).toFixed(2)}%)`; // currency format
                          }
                        }
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            :
              <div>Loading...</div>
            }
          </div>

          <div className="w-fit flex flex-col">
            <div>Top Expenses By Item</div>
            {expensesByItem ? 
              <div className="w-[450px] h-[300px]">
                <Bar
                  data={expensesByItem}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenses By Item"
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw as number; // get raw value
                            return `$${Number(value).toFixed(2)}`; // currency format
                          }
                        }
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            :
              <div>Loading...</div>
            }
          </div>

          <div className="w-fit flex flex-col">
            <div>Most Purchased Items</div>
            {frequenciesByItem ? 
              <div className="w-[450px] h-[300px]">
                <Bar
                  data={frequenciesByItem}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenses By Item"
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw as number; // get raw value
                            return `${value} purchases`; // currency format
                          }
                        }
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            :
              <div>Loading...</div>
            }
          </div>

          <div className="w-full bg-black p-10 px-12 text-white rounded">
            <h1 className="font-bold text-xl mb-8">Purchase History</h1>
            <div className="w-full flex flex-col gap-2">
              {[...purchaseHistory].reverse().slice(0, historyDisplayedLength).map((item, i) => (
                <div className="w-full flex gap-2 justify-between items-center pb-2 border-solid border-neutral-400 border-b-[1px]"
                    key={i}>
                  <div className="min-w-[260px] font-semibold flex gap-4 justify-start items-center">
                    <div>
                      {item.name}
                    </div>
                    <div className="w-fit bg-light text-black text-sm p-1 py-0 rounded-full">
                      ${Number(item.cost / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-navy text-white text-sm font-medium p-1 py-0 rounded">
                    {item.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
                  </div>
                  <div className="min-w-[400px] flex gap-1 justify-end">
                    <div className="flex gap-1 items-center text-green-300 font-medium">
                      <FontAwesomeIcon icon={faCrown} className="fa-regular text-xs" />
                      {item.purchasedBy.username}
                    </div>
                    <div className="flex">
                      {item.sharedBetween.map((user, i) => (
                        user.username !== item.purchasedBy.username ? 
                          <div className="mr-2"
                              key={i}>
                            {user.username}
                          </div>
                        :
                          <div key={i}></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {purchaseHistory.length > 10 &&
              <button className="p-2 pt-1 mt-4 font-bold border-solid border-gray-300 border-2 rounded"
                onClick={() => {
                  if (historyDisplayedLength < purchaseHistory.length) {
                    setHistoryDisplayedLength(purchaseHistory.length);
                  } else {
                    setHistoryDisplayedLength(10);
                  }
                }}
              >
                {historyDisplayedLength < purchaseHistory.length?
                  <span className="flex items-center gap-2 ">
                    <div>See More</div>
                    <FontAwesomeIcon icon={faCaretDown} className="fa-regular text-lg" />
                  </span>
                :
                <span className="flex items-center gap-2 ">
                  <div>See Less</div>
                  <FontAwesomeIcon icon={faCaretUp} className="fa-regular text-lg" />
                </span>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  );
}