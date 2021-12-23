// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimun) public {       
        Campaign campaign = new Campaign(minimun, msg.sender);
        deployedCampaigns.push(address(campaign));
    }

    function getAllDeployedCampaigns () public view returns (address[] memory contracts) {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    struct RequestInfo {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }

    address public manager;
    mapping(address => bool) public approvers;
    uint public minimunContribution;
    uint public aproversCount;
    uint numRequests;    
    mapping (uint => Request) requests;
    

    modifier restricted () {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimun, address creator) {
        manager = creator;
        minimunContribution = minimun;
    }

    function contribute () public payable {
        require(msg.value >= minimunContribution, 'Value less than minimun contribution');
        require(!approvers[msg.sender] , 'You already donated to this campaign');        
        approvers[msg.sender] = true;
        aproversCount++;
    }

    function createRequest (string memory description, uint value, address payable recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint requestIndex) public {
        require(approvers[msg.sender]);
        Request storage request = requests[requestIndex];
        require(!request.approvals[msg.sender]);
        request.approvalCount++;
        request.approvals[msg.sender] = true;
    }

    function getRequest(uint requestIndex) public view returns (RequestInfo memory request) {
        Request storage localRequest  = requests[requestIndex];
        RequestInfo memory resultRequest = RequestInfo({
            description: localRequest.description,
            value: localRequest.value,
            recipient: localRequest.recipient,
            complete: localRequest.complete,
            approvalCount: localRequest.approvalCount   
        });
        return resultRequest;
    }

    function processRequest (uint requestIndex) public restricted {
        Request storage request = requests[requestIndex];
        require(!request.complete, 'Request already completed');
        require(request.approvalCount > (aproversCount / 2), 'Request not approved');
        request.complete = true; 
        request.recipient.transfer(request.value);
    }

    function getSummary() public view returns (uint campaignMinimunContribution, uint campaignBalance, uint campaignNumRequests, uint campaignAproversCount, address campaignManager) {
        return (
            minimunContribution,
            address(this).balance,
            numRequests,
            aproversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint count) {
        return numRequests;
    }

}